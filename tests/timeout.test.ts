import { assert, expect } from "chai";

import { timeoutAfter, isTimeout } from "../src/utilities/timeout";
import { pause } from "./helpers";

describe("Timeout operations", () => {
  it("triggers after specified milliseconds", async () => {
    try {
      await Promise.race([pause(20), timeoutAfter(10)]);
      assert.fail("Failed to timeout");
    } catch (error) {
      expect(error.message).eq("Timeout after 10 milliseconds");
    }
  });

  it("has no effect if not triggered", async () => {
    try {
      await Promise.race([pause(1), timeoutAfter(20)]);
    } catch (error) {
      assert.fail("Timeout triggered");
    }
  });

  it("can be discerned from other Errors", async () => {
    try {
      await timeoutAfter(1);
    } catch (error) {
      if (!isTimeout(error)) {
        assert.fail("Expected to be able to discern timeout errors");
      }
    }

    try {
      throw new Error("boom");
    } catch (error) {
      if (isTimeout(error)) {
        assert.fail("Expected to be able to discern timeout errors");
      }
    }
  });
});
