import crypto from "crypto";

export function hashBlock(b) {
  return crypto.createHash("sha256").update(JSON.stringify(b)).digest("hex");
}

export function createBlock(index, prevHash, txs) {
  const block = {
    index,
    timestamp: Date.now(),
    prevHash,
    txs
  };
  block.hash = hashBlock(block);
  return block;
}
