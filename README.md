# bitburner-filesync

A file synchronisation utility for Bitburner, using the Remote File API.

It allows players to synchronize scripts and text files from their computer's disk to the game in both the Electron build and website.

## How to use (for users)
You must have a recent version of `npm` installed after which you can run
```
npx bitburner-filesync
```

This pulls and runs the latest release of bitburner-filesync for you.

## Configuration

The program, when ran, uses a local file to have itself configured to your preferences.
This file is `filesync.json` within the directory you start bitburner-filesync.

Here's an example of it's contents:

```js
{
  "allowedFiletypes": [
    ".js",
    ".script",
    ".txt"
  ],
  "allowDeletingFiles": false,
  "port": 12525,
  "scriptsFolder": ".",
  "quiet": false,
  "dry": false,
  "definitionFile": {
    "update": false,
    "location": "NetScriptDefinitions.d.ts"
  },
  "pushAllOnConnection": false
}
```
