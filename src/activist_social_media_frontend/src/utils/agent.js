import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/activist_social_media_backend/activist_social_media_backend.did.js";
export { idlFactory } from "../../../declarations/activist_social_media_backend/activist_social_media_backend.did.js";

export const canisterId =
  import.meta.env.VITE_CANISTER_ID_ACTIVIST_SOCIAL_MEDIA_BACKEND;

export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const backend = canisterId ? createActor(canisterId) : undefined;
console.log("env:", import.meta.env);