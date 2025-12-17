import React, { ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import { PetraWallet } from "petra-plugin-wallet-adapter";

// const wallets: any[] = [/* new PetraWallet() */];

export const AptosWalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AptosWalletAdapterProvider autoConnect={true} optInWallets={["Petra"]}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
