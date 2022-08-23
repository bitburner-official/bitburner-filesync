import * as fs from "fs";

let messageCounter = 0;

export function fileChangeEventToMsg({path}){
    const message = {
        "jsonrpc":"2.0",
        "method":"pushFile",
        "params":{
            "server":"home",
            "filename":path,
            "content":fs.readFileSync(path).toString()
        },
        "id":messageCounter++
    }
    return JSON.stringify(message);
}

export function fileRemovalEventToMsg({path}){
    const message = {
        "jsonrpc":"2.0",
        "method": "deleteFile",
        "params":{
            "filename": path,
        },
        "id":messageCounter++
    }
    return JSON.stringify(message);
}

export function requestDefinitionFile(){
    const message = {
        "jsonrpc": "2.0",
        "method": "getDefinitionFile",
        "id":messageCounter++
    }
    return JSON.stringify(message);
}