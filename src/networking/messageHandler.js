import { messageTracker } from "./messageTracker.js";
import { writeFile } from "fs";
import { config } from "../config.js";
import { EventType } from "../eventTypes.js";
import { fileChangeEventToMsg } from "./messageGenerators.js";

export function messageHandler(signaller, msg, paths) {
    let incoming;

    try { incoming = JSON.parse(msg.toString()); }
    catch (err) { return console.log(err); }
    console.log(incoming)
    if (incoming.id == undefined) return;

    if (incoming.result) {
        const request = messageTracker.get(incoming.id);
        if (request?.method &&
            request.method == "getDefinitionFile"
            && incoming.result) {
            writeFile(config.get("definitionFile").location, incoming.result, (err) => {
                if (err) return console.log(err);
            });
        }

        if (request?.method &&
            request.method == "getFileNames"
            && incoming.result) {
            const gameFiles = incoming.result.map(file => removeLeadingSlash(file));

            paths.forEach((stats, fileName) => {
                if (!stats.isDirectory() && !gameFiles.includes(fileName))
                    signaller.emit(EventType.MessageSend, fileChangeEventToMsg({ path: fileName }));
            })
        }
    }
}

function removeLeadingSlash(path) {
    const reg = /^\//;
    return path.replace(reg, "")
}