import crypto from "crypto";

export function createWallet() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const pub = publicKey.export({ type: "spki", format: "der" }).toString("hex");
  const priv = privateKey.export({ type: "pkcs8", format: "der" }).toString("hex");
  const address = crypto.createHash("sha256").update(pub).digest("hex").slice(0, 40);
  return { address, publicKey: pub, secretKey: priv };
}

export function sign(priv, msg) {
  const key = crypto.createPrivateKey({ key: Buffer.from(priv, "hex"), format: "der", type: "pkcs8" });
  return crypto.sign(null, Buffer.from(msg), key).toString("hex");
}

export function verify(pub, msg, sig) {
  const key = crypto.createPublicKey({ key: Buffer.from(pub, "hex"), format: "der", type: "spki" });
  return crypto.verify(null, Buffer.from(msg), key, Buffer.from(sig, "hex"));
}
