import { messageTracker } from "./messageTracker.js";
import {writeFile} from "fs";
import { config } from "../config.js";

export function messageHandler(msg) {
    let incoming;

    try {incoming = JSON.parse(msg.toString());}
    catch {return;}
    console.log(incoming)
    if (incoming.id == undefined) return;

    if (incoming.result) {
        const request = messageTracker.get(incoming.id);
        console.log(messageTracker.data);
        console.log("REQUEST: ", request);
        if (request.method &&
            request.method == "getDefinitionFile"
            && incoming.result) {
            writeFile(config.get("definitionFile").location, incoming.result, (err) => {
                if (err) return console.log(err);
                console.log("wrote definition")
            });
        }
    }
}