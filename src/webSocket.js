import { WebSocketServer } from 'ws';
import * as settings from "./settings.js";

export function setupSocket(signaller){

    const wss = new WebSocketServer({ port: settings.port });

    wss.on('connection', function connection(ws) {
      ws.on('message', function message(msg) {
        signaller.emit(EventType.MessageReceived, msg);
      });

      signaller.on(EventType.SendMessage, data => ws.send(data));
    });

    return wss;
}
