import { createBlock } from "./block.js";
import { applyTx } from "./state.js";

export function mine(state, txs, lastBlock) {
  txs.forEach(tx => applyTx(state, tx));
  return createBlock(lastBlock.index + 1, lastBlock.hash, txs);
}
