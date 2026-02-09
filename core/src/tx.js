import crypto from "crypto";
import { verify } from "./wallet.js";

export function makeTx(tx) {
  const base = `${tx.from}${tx.to}${tx.amount}${tx.fee}${tx.nonce}${tx.timestamp}`;
  tx.id = crypto.createHash("sha256").update(base).digest("hex");
  return tx;
}

export function verifyTx(tx, state) {
  const msg = `${tx.from}${tx.to}${tx.amount}${tx.fee}${tx.nonce}${tx.timestamp}`;
  if (!verify(tx.publicKey, msg, tx.sig)) return false;
  if ((state.balances[tx.from] || 0) < tx.amount + tx.fee) return false;
  if ((state.nonces[tx.from] || 0) !== tx.nonce) return false;
  return true;
}
