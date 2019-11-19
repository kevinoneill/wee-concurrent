import { Latch } from "../src/latch";

import { expect } from "chai";

describe("latch", () => {
  it("should release after the specified number of triggers", async () => {
    const latch = new Latch(2);

    let released = await latch.wait(1);
    expect(released).false;

    latch.release();
    released = await latch.wait(1);
    expect(released).false;

    latch.release();
    released = await latch.wait(1);
    expect(released).true;
  });
  it("should default to a single trigger", async () => {
    const latch = new Latch();

    let released = await latch.wait(1);
    expect(released).false;

    latch.release();
    released = await latch.wait(1);
    expect(released).true;
  });

  it("should not require release to be called for subsequent waits", async () => {
    const latch = new Latch();

    let released = await latch.wait(1);
    expect(released).false;

    latch.release();
    released = await latch.wait(1);
    expect(released).true;

    released = await latch.wait(1);
    expect(released).true;
  });
});
