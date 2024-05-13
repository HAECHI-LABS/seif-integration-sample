"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ARCTIC_1_VIEM_CHAIN } from "@sei-js/evm";

import { seifWallet } from "@/app/seifProvider/seifProvider";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function getWagmiConfig() {
  const connectors = connectorsForWallets(
    [
      {
        groupName: "Sei Native",
        wallets: [seifWallet],
      },
    ],
    {
      appName: "My RainbowKit App",
      projectId: "YOUR_PROJECT_ID",
    }
  );

  const config = createConfig({
    connectors: [...connectors],
    chains: [ARCTIC_1_VIEM_CHAIN],
    transports: {
      [ARCTIC_1_VIEM_CHAIN.id]: http(),
    },
  });

  return config;
}

export function RainbowKitSample() {
  const queryClient = getQueryClient();
  const wagmiConfig = getWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
