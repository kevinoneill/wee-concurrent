import { timeoutAfter, TimeoutError, isTimeout } from "../src/utilities/timeout";
import { pause } from "./helpers";

describe("Timeout operations", () => {
  it("triggers after specified milliseconds", async () => {
    try {
      await Promise.race([pause(20), timeoutAfter(10)]);
      fail("Failed to timeout");
    } catch (error) {
      expect(error.message).toEqual("Timeout after 10 milliseconds");
    }
  });

  it("has no effect if not triggered", async () => {
    try {
      await Promise.race([pause(1), timeoutAfter(20)]);
    } catch (error) {
      fail("Timeout triggered");
    }
  });

  it("can be discerned from other Errors", async () => {
    try {
      await timeoutAfter(1);
    } catch (error) {
      if (!isTimeout(error)) {
        fail("Expected to be able to discern timeout errors");
      }
    }

    try {
      throw new Error("boom");
    } catch (error) {
      if (isTimeout(error)) {
        fail("Expected to be able to discern timeout errors");
      }
    }
  });
});
