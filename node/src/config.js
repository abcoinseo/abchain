export function cfg(name) {
  return {
    node: name,
    port: name === "node1" ? 4001 : 4002,
    supply: 1_000_000_000
  };
}
