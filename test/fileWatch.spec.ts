import { setupWatch } from "../src/fileWatch";
import { expect } from "chai";
import { stub, createStubInstance } from "sinon";
import CheapWatch from "cheap-watch";
import signal from "signal-js";

describe("fileWatch", () => {
  describe("setupWatch", () => {
    it("should exist", () => {
      expect(setupWatch).to.exist;
    });

    it("should instantiate and initialize CheapWatch", async () => {
      const consoleStub = stub(console, "log");
      const watchInstance = createStubInstance(CheapWatch);
      const watchConstructorStub = stub().returns(watchInstance);
      Object.setPrototypeOf(CheapWatch, watchConstructorStub);

      const result = await setupWatch(signal);

      expect(result).to.eq(watchInstance);
      expect(watchConstructorStub).to.have.been.called;
      expect(watchInstance.init).to.have.been.called;
      expect(watchInstance.on).to.have.been.calledTwice;

      consoleStub.restore();
    });
  });
});
