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
import { useEffect } from "react";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const wagmiConfig = getDefaultConfig({
  appName: "YOUR_APP_NAME",
  projectId: "YOUR_PROJECT_ID",
  wallets: [
    {
      groupName: "Recommended",
      wallets: [seifWallet, metaMaskWallet, walletConnectWallet],
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
  useEffect(() => {
    window.addEventListener("eip6963:announceProvider", (event: any) => {
      const announcedProvider = {
        ...event.detail,
        connected: false,
        accounts: [],
      };
      console.log(announcedProvider);
    });
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function seifWallet(): Wallet {
  const injectedProvider = getExplicitInjectedProvider();
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
    rdns: "com.passkeywallet.seif",
  };
}

function getExplicitInjectedProvider() {
  if (typeof window === "undefined") return;
  if (window.ethereum && window.ethereum["__seif"]) {
    return window.ethereum;
  }

  if ((window as any)["__seif"]) {
    return (window as any)["__seif"];
  }

  return undefined;
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
