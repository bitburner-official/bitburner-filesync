import { messageTracker } from "./messageTracker.js";
import { Stats, writeFile } from "fs";
import { RawData } from "ws";
import { config } from "../config.js";
import { EventType } from "../eventTypes.js";
import { fileChangeEventToMsg } from "./messageGenerators.js";
import type { Signal } from "signal-js";
import { Message } from "../interfaces.js";

function deserialize(data: RawData): Message {
  const msg = JSON.parse(data.toString());

  if (typeof msg.jsonrpc !== "string" || msg.jsonrpc !== "2.0" || typeof msg.id !== "number") {
    throw Error("Malformed data received.");
  }

  const id: number = msg.id;
  const request = messageTracker.get(id);

  if (typeof request?.method !== "string") {
    throw Error("Malformed JSON received.");
  } else if (msg.error != null) {
    throw Error(msg.error);
  } else if (msg.result == null) {
    throw Error("Malformed JSON received.");
  }

  return { jsonrpc: "2.0", method: request.method, result: msg.result, id };
}

export function isStringArray(s: Array<unknown>): s is string[] {
  return s.every((s) => typeof s === "string");
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
    case "getFileNames": {
      if (!Array.isArray(incoming.result) || !isStringArray(incoming.result))
        return console.log("Malformed data received.");

      const gameFiles = incoming.result.map((file: string) => removeLeadingSlash(file));

      paths.forEach((stats, fileName) => {
        if (!stats.isDirectory() && !gameFiles.includes(fileName))
          signaller.emit(EventType.MessageSend, fileChangeEventToMsg({ path: fileName }));
      });
    }
  }
}

function removeLeadingSlash(path: string) {
  const reg = /^\//;
  return path.replace(reg, "");
}
