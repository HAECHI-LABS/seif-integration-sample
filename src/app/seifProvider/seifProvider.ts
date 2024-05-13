"use client";
import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { CreateConnector } from "@rainbow-me/rainbowkit/dist/wallets/Wallet";
import { createConnector } from "wagmi";
import { injected } from "wagmi/connectors";

function getExplicitInjectedProvider(flag: string) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined")
    return;
  const providers = window.ethereum.providers;
  return providers
    ? // @ts-expect-error - some provider flags are not typed in `InjectedProviderFlags`
      providers.find((provider) => provider[flag])
    : window.ethereum[flag]
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

export const seifWallet = (): Wallet => {
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
