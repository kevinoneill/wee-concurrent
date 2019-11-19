import { Semaphore } from "../src";
import { pause, range } from "./helpers";

import { expect } from "chai";

describe("Semaphore operations", () => {
  const concurrency = 2;
  let semaphore: Semaphore;

  let running: number;
  let executions: number;

  beforeEach(() => {
    semaphore = new Semaphore(concurrency);
    running = 0;
    executions = 0;
  });

  const run = async () => {
    running++;
    expect(running).lte(concurrency);
    await pause(10);
    expect(running).lte(concurrency);
    running--;
    executions++;
  };

  it("limits concurrency", async () => {
    const job = async () => {
      const release = await semaphore.acquire();
      await run();
      release();
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).eq(5);
  });

  it("limits workers", async () => {
    const job = async () => {
      await semaphore.execute(run);
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).eq(5);
  });

  it("recovers from worker errors", async () => {
    const explode = async () => {
      await semaphore.execute(async () => {
        await run();
        throw Error("boom");
      });
    };

    let error = undefined;
    try {
      await semaphore.execute(explode);
    } catch (e) {
      error = e;
    }
    await semaphore.execute(run);

    expect(error).not.undefined;
    expect(executions).eq(2);
  });

  it("respects timeout", async () => {
    const blocker = async () => {
      semaphore.acquire();
    };
    const job = async () => {
      let error = undefined;
      try {
        await semaphore.acquire(10);
      } catch (e) {
        error = e;
      }

      expect(error).not.undefined;
    };

    await Promise.all([...range(0, 2).map(blocker), job()]);
  });

  it("is safe from over release", async () => {
    const job = async () => {
      const release = await semaphore.acquire();
      await run();
      release();
      release();
    };

    await Promise.all(range(0, 5).map(job));
    expect(executions).eq(5);
  });
});
