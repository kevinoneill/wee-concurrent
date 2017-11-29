import { Gate, Release, Worker } from "./types";
import { Semaphore } from "./semaphore";

/**
 * A simple lock that allows one holder
 */
export class Mutex implements Gate {
  private semaphore: Semaphore = new Semaphore(1);

  acquire(timeout?: number): Promise<Release> {
    return this.semaphore.acquire(timeout);
  }

  execute<T>(worker: Worker<T>, timeout?: number): Promise<T> {
    return this.semaphore.execute(worker, timeout);
  }
}
