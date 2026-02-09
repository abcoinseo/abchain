import fs from "fs";
import { cfg } from "./config.js";
import { start } from "./server.js";

const node = process.argv[2];
const c = cfg(node);
const dir = `./data/${node}`;
fs.mkdirSync(dir, { recursive: true });

start({ ...c, dir });
