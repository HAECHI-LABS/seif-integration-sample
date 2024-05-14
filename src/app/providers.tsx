"use client";
import { ConnectButton, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ARCTIC_1_VIEM_CHAIN } from "@sei-js/evm";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider } from "wagmi";
import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { CreateConnector } from "@rainbow-me/rainbowkit/dist/wallets/Wallet";
import { createConnector } from "wagmi";
import { injected } from "wagmi/connectors";

const wagmiConfig = getDefaultConfig({
  appName: "YOUR_APP_NAME",
  projectId: "YOUR_PROJECT_ID",
  wallets: [
    {
      groupName: "Sei Native",
      wallets: [seifWallet],
    },
  ],
  chains: [ARCTIC_1_VIEM_CHAIN],
  transports: {
    [ARCTIC_1_VIEM_CHAIN.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function seifWallet(): Wallet {
  const injectedProvider = getExplicitInjectedProvider("__seif");
  return {
    id: "seif",
    name: "Seif",
    installed: !!injectedProvider,
    iconUrl: "https://wallet-edge.vercel.app/static/SeifIcon.svg",
    iconBackground: "#fff",
    downloadUrls: {
      chrome:
        "https://chromewebstore.google.com/detail/seif/albakdmmdafeafbehmcpoejenbeojejl",
    },
    createConnector: createInjectedConnector(injectedProvider),
  };
};

function getExplicitInjectedProvider(flag: string) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined")
    return;
  return window.ethereum[flag]
    ? window.ethereum
    : undefined;
}

function createInjectedConnector(provider?: any): CreateConnector {
  return (walletDetails: WalletDetailsParams) => {
    // Create the injected configuration object conditionally based on the provider.
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.rkDetails.id,
            name: walletDetails.rkDetails.name,
            provider,
          }),
        }
      : {};

    return createConnector((config) => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails,
    }));
  };
}

