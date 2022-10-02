import { messageTracker } from "./messageTracker";
import { Stats, writeFile } from "fs";
import { RawData } from "ws";
import { config } from "../config";
import { EventType } from "../eventTypes";
import { fileChangeEventToMsg } from "./messageGenerators";
import type { Signal } from "signal-js";
import { Message } from "../interfaces";

function deserialize(data: RawData): Message | void {
  let msg;

  try {
    msg = JSON.parse(data.toString());
  } catch (err) {
    return console.log(err);
  }

  if (typeof msg.jsonrpc !== "string" || msg.jsonrpc !== "2.0" || typeof msg.id !== "number") return;

  const id: number = msg.id;
  const request = messageTracker.get(id);

  if (typeof request?.method !== "string") return;
  else if (msg.error != null) return { jsonrpc: "2.0", error: msg.error, id };
  else if (msg.result == null) return;

  return { jsonrpc: "2.0", method: request.method, result: msg.result, id };
}

function isStringArray(s: Array<unknown>): s is string[] {
  return s.every((s) => typeof s === "string");
}

export function messageHandler(signaller: Signal, data: RawData, paths: Map<string, Stats>) {
  const incoming = deserialize(data);

  if (incoming == null) {
    return console.log("Malformed data received.");
  } else if (incoming.error) {
    return console.log(incoming.error);
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
