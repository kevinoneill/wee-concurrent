import { Mutex, Release } from "../src";
import { pause, range } from "./helpers";

describe("Mutex operations", () => {
  let mutex: Mutex;

  let running: number;
  let executions: number;

  beforeEach(() => {
    mutex = new Mutex();
    running = 0;
    executions = 0;
  });

  const run = async () => {
    running++;
    expect(running).toBeLessThanOrEqual(1);
    await pause(10);
    expect(running).toBeLessThanOrEqual(1);
    running--;
    executions++;
  };

  it("limits concurrency", async () => {
    const job = async () => {
      const release = await mutex.acquire();
      await run();
      release();
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).toEqual(5);
  });

  it("limits workers", async () => {
    const job = async () => {
      await mutex.execute(run);
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).toEqual(5);
  });

  it("respects timeout", async () => {
    const blocker = async () => {
      mutex.acquire();
    };
    const job = async () => {
      let error = undefined;
      try {
        await mutex.acquire(10);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    };

    await Promise.all([blocker(), job()]);
  });

  it("is safe from over release", async () => {
    const job = async () => {
      const release = await mutex.acquire();
      await run();
      release();
      release();
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).toEqual(5);
  });
});
