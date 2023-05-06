import CheapWatch from "cheap-watch";
import { config } from "./config";
import { EventType } from "./eventTypes";
import { mkdir } from "fs/promises";
import { resolve } from "path";
import type { Signal } from "signal-js";
import type { File } from "./interfaces";

function fileFilter(file: File) {
  if (config.get("allowedFiletypes").some((extension) => file.path.endsWith(extension))) return true;
  if (file.stats.isDirectory()) return true;
  return false;
}

export async function setupLogsFolder() {
  try {
    await mkdir(resolve(config.get("logFiles").localLocation));
  } catch (err) {
    if (isError(err) && err.code !== "EEXIST") {
      console.log(`Failed to create folder '${config.get("logFiles").localLocation}' (${err.code})`);
      process.exit();
    }
  }
}

function isError(err: unknown): err is NodeJS.ErrnoException {
  return (err as NodeJS.ErrnoException).code !== undefined;
}

export async function setupWatch(signaller: Signal) {
  try {
    await mkdir(resolve(config.get("scriptsFolder")));
  } catch (err) {
    if (isError(err) && err.code !== "EEXIST") {
      console.log(`Failed to watch folder '${config.get("scriptsFolder")}' (${err.code})`);
      process.exit();
    }
  }

  const watch = new CheapWatch({
    dir: config.get("scriptsFolder"),
    filter: fileFilter,
    watch: !config.get("dry"),
  });

  if (!config.get("quiet")) console.log("Watching folder", resolve(config.get("scriptsFolder")));

  watch.on("+", (fileEvent) => {
    if (fileEvent.stats.isFile()) signaller.emit(EventType.FileChanged, fileEvent);
  });
  watch.on("-", (fileEvent) => {
    if (fileEvent.stats.isFile()) signaller.emit(EventType.FileDeleted, fileEvent);
  });

  // Wait 'till filewatcher is ready to go
  await watch.init();

  if (config.get("dry")) {
    console.log("Watch would've synchronised:\n", watch.paths);
    process.exit();
  }

  return watch;
}
