import CheapWatch from "cheap-watch";
import { config } from "./config.js";
import { EventType } from "./eventTypes.js";
import { mkdir } from "fs/promises";
import { resolve, relative, isAbsolute } from "path";
import type { Signal } from "signal-js";
import type { File } from "./interfaces.js";

/**
 * Returns true if the given file should be watched.
 * @param file The provided file.
 */
function fileFilter(file: File) {
  // If the file is excluded, skip all other checks and ignore it.
  if (config.get("exclude").some(x => isSubDirOf(file.path, x))) return false;
  if (config.get("allowedFiletypes").some((extension) => file.path.endsWith(extension))) return true;
  if (file.stats.isDirectory()) return true;
  return false;
}

/**
 * Returns true if a directory is a subdirectory of a parent directory (not necessarily strict).
 * @param dir The directory to perform the check on.
 * @param parent The parent directory.
 */
function isSubDirOf(dir: string, parent: string) {
  const relPath = relative(resolve(parent), resolve(dir));
  return !!relPath && !relPath.startsWith('..') && !isAbsolute(relPath);
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
