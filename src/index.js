"use strict"
import { setupWatch } from "./fileWatch.js";
import * as settings from "./settings.js";
import { setupSocket } from "./webSocket.js";
import signal from "signal-js";
import { fileChangeEventToMsg, fileRemovalEventToMsg, requestDefinitionFile } from "./messageGenerators.js";

const watch = await setupWatch(signal);
const socket = setupSocket(signal);

signal.on("fileChange", fileEvent => {
    console.log(fileEvent.path + " changed");
    signal.emit(EventType.SendMessage, fileChangeEventToMsg(fileEvent))
});

if(settings.allowDeletingFiles)
    signal.on("fileDeletion", fileEvent => 
        signal.emit(EventType.SendMessage, fileRemovalEventToMsg(fileEvent)));


console.log(`Server is ready, running on ${settings.port}!`)

process.on('SIGINT', function() {
    console.log("Shutting down!");

    watch.close();
    socket.close();
    process.exit();
});
