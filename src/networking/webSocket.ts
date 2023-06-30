import type { Signal } from "signal-js";
import { WebSocketServer } from "ws";
import { config } from "../config.js";
import { EventType } from "../eventTypes.js";
import { Message } from "../interfaces.js";
import { messageTracker } from "./messageTracker.js";

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
