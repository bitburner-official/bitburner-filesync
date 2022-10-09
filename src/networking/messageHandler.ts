import { messageTracker } from "./messageTracker";
import { Stats, writeFile } from "fs";
import { RawData } from "ws";
import { config } from "../config";
import { EventType } from "../eventTypes";
import { fileChangeEventToMsg, requestAllFiles } from "./messageGenerators";
import type { Signal } from "signal-js";
import { FileContent, Message } from "../interfaces";

/*function deserialize(data: RawData): Message {
  const msg = JSON.parse(data.toString());

  if (typeof msg.jsonrpc !== "string" || msg.jsonrpc !== "2.0" || typeof msg.id !== "number") {
    throw Error("Malformed data received.");
  }

  const id: number = msg.id;
  let request = messageTracker.get(id);

  console.log(msg);

  if (msg.error != null) {
    throw Error(msg.error);
  } else if (msg.result == null) {
    throw Error("Malformed JSON received.");
  }

  return { jsonrpc: "2.0", method: !request? msg.method : request.method, result: msg.result, id };
}*/

function deserialize(data: RawData): Message {
  const msg = JSON.parse(data.toString());

  if (typeof msg.jsonrpc !== "string" || msg.jsonrpc !== "2.0" || typeof msg.id !== "number") {
    throw Error("Malformed data received.");
  }

  const id: number = msg.id;
  const request = id === Number.MAX_SAFE_INTEGER ? { method: msg.method } : messageTracker.get(id);

  console.log("M:", msg);
  console.log("R:", request);

  if (msg.error != null) {
    throw Error(msg.error);
  }

  return { jsonrpc: "2.0", method: request?.method, result: msg.result, id };
}

export function isStringArray(s: Array<unknown>): s is string[] {
  return s.every((s) => typeof s === "string");
}

export function isFileContentArray(a: Array<unknown>): a is FileContent[] {
  return a.every((f) => !!f && Object.hasOwn(f, "filename") && Object.hasOwn(f, "content"));
}

export function messageHandler(signaller: Signal, data: RawData, paths: Map<string, Stats>) {
  let incoming;

  try {
    incoming = deserialize(data);
  } catch (err) {
    if (err instanceof Error) return console.log(err.message);
    else throw err;
  }

  switch (incoming.method) {
    case "getDefinitionFile":
      if (typeof incoming.result !== "string") return console.log("Malformed data received.");

      writeFile(config.get("definitionFile").location, incoming.result, (err) => {
        if (err) return console.log(err);
      });
      break;

    case "getFileNames":
      if (!Array.isArray(incoming.result) || !isStringArray(incoming.result))
        return console.log("Malformed data received.");

      const gameFiles = incoming.result.map((file: string) => removeLeadingSlash(file));

      paths.forEach((stats, fileName) => {
        if (!stats.isDirectory() && !gameFiles.includes(fileName))
          signaller.emit(EventType.MessageSend, fileChangeEventToMsg({ path: fileName }));
      });
      break;

    case "getAllFiles":
      if (!Array.isArray(incoming.result) || !isFileContentArray(incoming.result))
        return console.log("Malformed data received.");

      const gameFiles2 = incoming.result.map((f: FileContent) => {
        return { filename: removeLeadingSlash(f.filename), content: f.content };
      });

      gameFiles2.forEach((f) => console.log(f));
      break;

    case "manualPullFromGame":
      console.log("PULL");
      signaller.emit(EventType.MessageSend, requestAllFiles());
      break;

    case "manualPushToGame":
      console.log("PUSH");
      paths.forEach((stats, fileName) => {
        if (!stats.isDirectory()) signaller.emit(EventType.MessageSend, fileChangeEventToMsg({ path: fileName }));
      });
      break;
  }
}

function removeLeadingSlash(path: string) {
  const reg = /^\//;
  return path.replace(reg, "");
}
