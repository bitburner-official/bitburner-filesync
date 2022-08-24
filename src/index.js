"use strict"
import { setupWatch } from "./fileWatch.js";
import { config, loadConfig } from "./config.js";
import { setupSocket } from "./networking/webSocket.js";
import signal from "signal-js";
import { fileChangeEventToMsg, fileRemovalEventToMsg, requestDefinitionFile } from "./networking/messageGenerators.js";
import { EventType } from "./eventTypes.js";
import { messageHandler } from "./networking/messageHandler.js";

export async function start() {
    loadConfig();
    const watch = await setupWatch(signal);
    const socket = setupSocket(signal);

    signal.on(EventType.MessageReceived, msg => messageHandler(msg));

    signal.on(EventType.FileChanged, fileEvent => {
        if (!config.get("quiet")) console.log(fileEvent.path + " changed");
        signal.emit(EventType.MessageSend, fileChangeEventToMsg(fileEvent))
    });

    if (config.get("allowDeletingFiles"))
        signal.on(EventType.FileDeleted, fileEvent =>
            signal.emit(EventType.MessageSend, fileRemovalEventToMsg(fileEvent)));

    console.log(`Server is ready, running on ${config.get("port")}!`)

    process.on('SIGINT', function () {
        console.log("Shutting down!");

        watch.close();
        socket.close();
        process.exit();
    });
}