import { expect } from "chai";
import { FileData } from "../../src/interfaces";
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

  describe("addLeadingSlash", () => {
    it("should add a leading slash if a file in a folder is sent", () => {
      const msg = fileRemovalEventToMsg({path: "sub/test.js"});
      const result = (msg?.params as FileData).filename;

      if(result && result.hasOwnProperty("filename"))
        expect(result).to.eq("/sub/test.js")
    });
  });

  describe("addLeadingSlash", () => {
    it("should not add a leading slash if a file in the root folder is sent", () => {
      const msg = fileRemovalEventToMsg({path: "test.js"});
      const result = (msg?.params as FileData).filename;

      if(result && result.hasOwnProperty("filename"))
        expect(result).to.eq("test.js")
    });
  });

  describe("addLeadingSlash", () => {
    it("should return with one leading slash if a file in a folder is sent and file already is prefixed", () => {
      const msg = fileRemovalEventToMsg({path: "/sub/test.js"});
      const result = (msg?.params as FileData).filename;

      if(result && result.hasOwnProperty("filename"))
        expect(result).to.eq("/sub/test.js")
    });
  });


});
