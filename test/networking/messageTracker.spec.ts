import { expect } from "chai";
import { messageTracker } from "../../src/networking/messageTracker";

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

describe("messageTracker", () => {
  it("should exist", () => {
    expect(messageTracker).to.exist;
  });

  it("should return entered value at index", () => {
    messageTracker.push({ jsonrpc: "2.0", id: 0, result: "testvalue0" });
    const msg = messageTracker.get(0);

    expect(msg?.result).to.eq("testvalue0");
  });

  it("should throw away values after entering more than it's max amount", () => {
    for (const i of range(0, 200)) {
      messageTracker.push({ jsonrpc: "2.0", id: i, result: `testvalue${i}` });
    }

    const msg0 = messageTracker.get(0);
    const msg1 = messageTracker.get(1);
    const msg200 = messageTracker.get(200);

    expect(msg0).to.eq(undefined);
    expect(msg1?.result).to.eq("testvalue1");
    expect(msg200?.result).to.eq("testvalue200");
  })
});
