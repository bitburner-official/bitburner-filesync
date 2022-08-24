import CheapWatch from "cheap-watch";
import {config} from "./config.js";
import {EventType} from "./eventTypes.js";
import {resolve } from "path";

function fileFilter(event) {
    if(config.get("allowedFiletypes").some(extension => event.path.endsWith(extension)))
        return true;
}

export async function setupWatch(signaller) {

    const watch = new CheapWatch({
        dir: config.get("scriptsFolder"),
        filter: fileFilter
    });

    if(!config.get("quiet")) console.log("Watching folder", resolve(config.get("scriptsFolder")))

    watch.on('+', fileEvent => signaller.emit(EventType.FileChanged, fileEvent));
    watch.on('-', fileEvent => signaller.emit(EventType.FileDeleted, fileEvent));

    // Wait 'till filewatcher is ready to go
    await watch.init();

   if(config.get("dry")) {
      console.log("Watch would've synchronised:\n", watch.paths)
      process.exit();
    }

    return watch;
}