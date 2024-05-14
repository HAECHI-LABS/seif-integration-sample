import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-5 p-24">
      <ConnectButton />
    </main>
  );
}
