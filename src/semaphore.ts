import { Gate, Release, Worker } from "./types";
import { timeoutAfter } from "./utilities/timeout";

/**
 * A lock that allows multiple holders
 */
export class Semaphore implements Gate {
  private queue: Release[] = [];
  private capacity: number;

  /**
   * Creates a `Semaphore` with the specified concurrency
   *
   * @param concurrency number of concurrent holders
   */
  constructor(concurrency: number) {
    this.capacity = concurrency;
  }

  public acquire(timeout?: number): Promise<Release> {
    const release = new Promise<Release>((resolve, reject) => {
      const latch = () => {
        let active = true;
        resolve(() => {
          if (active) {
            active = false;
            this.capacity++;
            this.schedule();
          }
        });
      };

      this.queue.push(latch);
      process.nextTick(this.schedule.bind(this));
    });

    return timeout && timeout > 0 ? Promise.race([release, timeoutAfter<Release>(timeout)]) : release;
  }

  async execute<T>(worker: Worker<T>, timeout?: number): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const release = await this.acquire(timeout);
      try {
        const result = await worker();
        resolve(result);
        release();
      } catch (error) {
        release();
        reject(error);
      }
    });
  }

  private schedule() {
    if (this.queue.length > 0 && this.capacity > 0) {
      this.capacity--;
      const next = this.queue.shift();
      if (undefined === next) {
        throw Error("Internal inconsistency: Queue contained undefined entry");
      }

      next();
    }
  }
}
