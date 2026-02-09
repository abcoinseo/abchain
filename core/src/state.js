export function applyTx(state, tx) {
  state.balances[tx.from] -= tx.amount + tx.fee;
  state.balances[tx.to] = (state.balances[tx.to] || 0) + tx.amount;
  state.nonces[tx.from] += 1;
}
