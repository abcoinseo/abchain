import fs from "fs";

export function ensure(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "");
}

export function append(file, obj) {
  ensure(file);
  fs.appendFileSync(file, JSON.stringify(obj) + "\n");
}

export function readLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
}

export function readJSON(file, def = {}) {
  if (!fs.existsSync(file)) return def;
  return JSON.parse(fs.readFileSync(file));
}

export function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
