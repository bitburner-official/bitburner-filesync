import {readFileSync} from "fs";
import {config} from "../config.js";
import {join} from "path";

let messageCounter = 0;

export function fileChangeEventToMsg({path}){
    return {
        "jsonrpc":"2.0",
        "method":"pushFile",
        "params":{
            "server":"home",
            "filename":"/"+path,
            "content":readFileSync(join(config.get("scriptsFolder"), path)).toString()
        },
        "id":messageCounter++
    }
}

export function fileRemovalEventToMsg({path}){
    return {
        "jsonrpc":"2.0",
        "method": "deleteFile",
        "params":{
            "filename": path,
        },
        "id":messageCounter++
    }
}

export function requestDefinitionFile(){
    return {
        "jsonrpc": "2.0",
        "method": "getDefinitionFile",
        "id":messageCounter++
    }
}

export function requestFilenames(){
    return {
        "jsonrpc": "2.0",
        "method": "getFileNames",
        "params": {
            "server": "home",
        },
        "id":messageCounter++
    }
}