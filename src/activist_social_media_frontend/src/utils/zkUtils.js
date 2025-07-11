import { groth16 } from "snarkjs";

/**
 * Convert secret phrase into SHA-256 hash as a BigInt,
 * which matches typical Circom circuit inputs.
 */
async function hashSecret(secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return BigInt("0x" + hashHex);
}

/**
 * Generate zk-SNARK proof using circom wasm & zkey directly in browser.
 * Returns: { proof, publicSignals, nullifier_hash }
 */
export async function generateOwnershipProof(secret) {
  const hashedSecret = await hashSecret(secret);

  const input = {
    secret: hashedSecret.toString()
  };

  const { proof, publicSignals } = await groth16.fullProve(
    input,
    "/zk/ownership_js/ownership.wasm",
    "/zk/ownership.zkey"
  );

  // nullifier_hash typically your circuit's first public signal
  const nullifier_hash = publicSignals[0];

  return { proof, publicSignals, nullifier_hash };
}

/**
 * Verify proof on the client (can also do on chain).
 */
export async function verifyOwnershipProof(proof, publicSignals) {
  const vkResp = await fetch("/zk/verification_key.json");
  const vk = await vkResp.json();

  return await groth16.verify(vk, publicSignals, proof);
}
