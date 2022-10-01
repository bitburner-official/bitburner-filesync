import { expect } from "chai";
import {
  fileChangeEventToMsg,
  fileRemovalEventToMsg,
  requestDefinitionFile,
  requestFilenames,
} from "../../src/networking/messageGenerators";

describe("messageGenerators", () => {
  describe("fileChangeEventToMsg", () => {
    it("should exist", () => {
      expect(fileChangeEventToMsg).to.exist;
    });
  });

  describe("fileRemovalEventToMsg", () => {
    it("should exist", () => {
      expect(fileRemovalEventToMsg).to.exist;
    });
  });

  describe("requestDefinitionFile", () => {
    it("should exist", () => {
      expect(requestDefinitionFile).to.exist;
    });
  });

  describe("requestFilenames", () => {
    it("should exist", () => {
      expect(requestFilenames).to.exist;
    });
  });
});
