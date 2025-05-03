import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { lukso, luksoTestnet } from "wagmi/chains";

export function getConfig() {
  return createConfig({
    chains: [lukso, luksoTestnet],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [lukso.id]: http(),
      [luksoTestnet.id]: http(),
    },
  });
}
