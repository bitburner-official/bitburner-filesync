import type { Signal } from "signal-js";
import { WebSocketServer } from "ws";
import { config } from "../config";
import { EventType } from "../eventTypes";
import { Message } from "../interfaces";
import { requestDefinitionFile } from "./messageGenerators";
import { messageTracker } from "./messageTracker";

export function setupSocket(signaller: Signal) {
  const wss = new WebSocketServer({ port: config.get("port") });

  wss.on("connection", function connection(ws) {
    function sendMessage(msg: Message) {
      messageTracker.push(msg);
      ws.send(JSON.stringify(msg));
    }

    ws.on("message", (msg) => {
      signaller.emit(EventType.MessageReceived, msg);
    });

    signaller.on(EventType.MessageSend, (msg: Message) => {
      sendMessage(msg);
    });

    signaller.trigger(EventType.ConnectionMade);
  });

  return wss;
}
