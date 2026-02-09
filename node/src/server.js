import express from "express";
import path from "path";
import { createWallet } from "../../core/src/wallet.js";
import { makeTx, verifyTx } from "../../core/src/tx.js";
import { mine } from "../../core/src/miner.js";
import { append, readLines, readJSON, writeJSON } from "../../core/src/storage.js";

export function start({ node, port, supply, dir }) {
  const adminFile = `${dir}/admin.json`;
  const stateFile = `${dir}/state.json`;
  const blocksFile = `${dir}/blocks.jsonl`;
  const txpoolFile = `${dir}/txpool.jsonl`;

  let admin = readJSON(adminFile, null);
  if (!admin) {
    admin = createWallet();
    writeJSON(adminFile, admin);
    console.log("ADMIN:", admin);
  }

  let state = readJSON(stateFile, { balances: {}, nonces: {} });
  if (!state.balances[admin.address]) {
    state.balances[admin.address] = supply;
    state.nonces[admin.address] = 0;
    writeJSON(stateFile, state);
  }

  const app = express();
  app.use(express.json());

  app.post("/wallet/create", (_, r) => r.json(createWallet()));

  app.post("/tx/send", (req, res) => {
    const tx = makeTx(req.body);
    if (!verifyTx(tx, state)) return res.status(400).json({ error: "invalid tx" });
    append(txpoolFile, tx);
    res.json({ ok: true, txid: tx.id });
  });

  app.post("/mine", (_, res) => {
    const txs = readLines(txpoolFile);
    if (!txs.length) return res.json({ msg: "no tx" });
    const blocks = readLines(blocksFile);
    const last = blocks.at(-1) || { index: 0, hash: "0" };
    const block = mine(state, txs, last);
    append(blocksFile, block);
    writeJSON(stateFile, state);
    writeJSON(txpoolFile, []);
    res.json(block);
  });

  app.get("/blocks", (_, r) => r.json(readLines(blocksFile).reverse()));
  app.get("/address/:a", (q, r) => r.json({ balance: state.balances[q.params.a] || 0 }));

  app.listen(port, () => console.log(`[${node}] running :${port}`));
}
