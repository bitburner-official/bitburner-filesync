"use strict"
import { setupWatch } from "./fileWatch.js";
import { config, loadConfig } from "./config.js";
import { setupSocket } from "./networking/webSocket.js";
import signal from "signal-js";
import { fileChangeEventToMsg, fileRemovalEventToMsg, requestFilenames, requestDefinitionFile } from "./networking/messageGenerators.js";
import { EventType } from "./eventTypes.js";
import { messageHandler } from "./networking/messageHandler.js";

export async function start() {
    loadConfig();
    const watch = await setupWatch(signal);
    const socket = setupSocket(signal);

    // Add a handler for received messages.
    signal.on(EventType.MessageReceived, msg => messageHandler(signal, msg, watch.paths));

    // Add a handler for when a connection to a game is made.
    signal.on(EventType.ConnectionMade, () => {
        console.log("Connection made!");

        if (config.get("definitionFile").update) {
            signal.emit(EventType.MessageSend, requestDefinitionFile());
        }

        if (config.get("pushAllOnConnection")) {
            const extensions = config.get("allowedFiletypes");
            for (const path of watch.paths.keys()) {
                if (extensions.some(extension => path.endsWith(extension)))
                    signal.emit(EventType.MessageSend, fileChangeEventToMsg({ path: path }))
            }
        } else {
            // Upload missing files to the game.
            signal.emit(EventType.MessageSend, requestFilenames());
        }
    })

    // Add a handler for changed files.
    signal.on(EventType.FileChanged, fileEvent => {
        if (!config.get("quiet")) console.log(fileEvent.path + " changed");
        signal.emit(EventType.MessageSend, fileChangeEventToMsg(fileEvent))
    });

    // Add a handler for removed files, if allowed.
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
