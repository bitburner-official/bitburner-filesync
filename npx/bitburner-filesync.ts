#!/usr/bin/env -S node --experimental-specifier-resolution=node
import { start, push, pull } from "../src/index";
import parser from "yargs-parser";

const argv = parser(process.argv.slice(2));

if (argv.push == true) await push();
else if (argv.pull == true) await pull();
else await start();
