import CheapWatch from "cheap-watch";
import * as settings from "./settings.js";

function fileFilter(event) {
    if(settings.allowedFiletypes.some(extension => event.path.endsWith(extension)))
        return true;
}

export async function setupWatch(signaller) {

    const watch = new CheapWatch({
        dir: settings.scriptsFolder,
        filter: fileFilter
    });

    watch.on('+', fileEvent => signaller.emit(EventType.FileChanged, fileEvent));
    watch.on('-', fileEvent => signaller.emit(EventType.FileDeleted, fileEvent));

    // Wait 'till filewatcher is ready to go
    await watch.init();

    return watch;
}