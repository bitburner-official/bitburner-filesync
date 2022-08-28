import convict from "convict";
import { existsSync } from "fs";

// Define a schema
export let config = convict({
    allowedFiletypes: {
        doc: 'Filetypes that are synchronized to the game.',
        format: 'Array',
        default: [".js", ".script", ".txt"]
    },
    allowDeletingFiles: {
        doc: 'Allow deleting files in game if they get deleted off disk.',
        format: 'Boolean',
        default: false,
        arg: 'allowDeletingFiles',
    },
    port: {
        doc: 'The port to bind to.',
        format: 'Number',
        default: 12525,
        env: 'BB_PORT',
        arg: 'port'
    },
    scriptsFolder: {
        doc: 'The to be synchronized folder.',
        format: 'String',
        default: '.',
        env: 'BB_SCRIPTFOLDER',
        arg: 'folder'
    },
    quiet: {
        doc: 'Log less internal events to stdout.',
        format: 'Boolean',
        env: 'BB_VERBOSE',
        default: false,
        arg: 'quiet'
    },
    dry: {
        doc: 'Only print the files to be synchronised.',
        format: 'Boolean',
        env: 'BB_DRY',
        default: false,
        arg: 'dry'
    },
    definitionFile: {
        update: {
            doc: 'Automatically pull the definition file from the game.',
            format: 'Boolean',
            env: 'BB_UPDATE_DEF',
            default: false
        },
        location: {
            doc: 'Location/name of where the definition file gets placed.',
            format: 'String',
            env: 'BB_LOCATION_DEF',
            default: "./NetScriptDefinitions.d.ts"
        }
    },
    pushAllOnConnection: {
        doc: 'Push all files when initial connection is made.',
        format: 'Boolean',
        env: 'BB_CON_PUSH',
        default: false,
        arg: 'pushAllOnConnection'
    }
});

export function loadConfig() {
    const configFile = "filesync.json";
    if (existsSync(configFile)) {
        try {
            config.loadFile(configFile);
        } catch (e) {
            throw new Error(`Unable to load configuration file at ${configFile}: ${e}`);
        }
    } else if (!config.get("quiet")) {
        console.log("No configuration file found.")
    }

    // Perform validation
    config.validate({ allowed: 'strict' });
}


