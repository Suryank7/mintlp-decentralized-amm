import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token, Pool, LPPosition, SlippageSettings, Transaction, UserPortfolio } from '@/types';
import { MOCK_TOKENS } from '@/services/mockData';
import { PoolService } from '@/services/poolService';
import { LiquidityService } from '@/services/liquidityService';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface AMMContextType {
  tokens: Token[];
  pools: Pool[];
  positions: LPPosition[];
  transactions: Transaction[];
  slippageSettings: SlippageSettings;
  portfolio: UserPortfolio;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  updateSlippageSettings: (settings: SlippageSettings) => void;
  refreshData: () => void;
  addTransaction: (transaction: Transaction) => void;
}

const AMMContext = createContext<AMMContextType | undefined>(undefined);

export function AMMProvider({ children }: { children: ReactNode }) {
  const { connected, connect, disconnect, wallets } = useWallet();
  const [tokens] = useState<Token[]>(MOCK_TOKENS);
  const [pools, setPools] = useState<Pool[]>([]);
  const [positions, setPositions] = useState<LPPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [slippageSettings, setSlippageSettings] = useState<SlippageSettings>({
    tolerance: 0.005,
    deadline: 20,
    autoSlippage: true,
  });

  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    totalValueUSD: 0,
    positions: [],
    totalFeesEarnedUSD: 0,
    totalImpermanentLoss: 0,
  });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (connected) {
      setPositions(LiquidityService.getAllPositions()); // In real app, fetch from chain
      updatePortfolio();
    } else {
      setPositions([]);
      setPortfolio({
        totalValueUSD: 0,
        positions: [],
        totalFeesEarnedUSD: 0,
        totalImpermanentLoss: 0,
      });
    }
  }, [connected]);

  useEffect(() => {
    if (connected) {
      updatePortfolio();
    }
  }, [positions, connected]);

  const refreshData = () => {
    setPools(PoolService.getAllPools());
    if (connected) {
      setPositions(LiquidityService.getAllPositions());
    }
  };

  const updatePortfolio = () => {
    const totalValueUSD = positions.reduce((sum, pos) => sum + pos.valueUSD, 0);
    const totalFeesEarnedUSD = positions.reduce((sum, pos) => sum + pos.accumulatedFeesUSD, 0);
    const totalImpermanentLoss = positions.reduce((sum, pos) => sum + pos.impermanentLoss, 0);

    setPortfolio({
      totalValueUSD,
      positions,
      totalFeesEarnedUSD,
      totalImpermanentLoss,
    });
  };

  const connectWallet = () => {
    // Basic auto-connect to Petra or first available for this demo
    // In production, you'd show a modal to select wallet
    const petra = wallets.find(w => w.name === "Petra");
    if (petra) {
      connect(petra.name);
    } else if (wallets.length > 0) {
      connect(wallets[0].name);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setTransactions([]);
  };

  const updateSlippageSettings = (settings: SlippageSettings) => {
    setSlippageSettings(settings);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <AMMContext.Provider
      value={{
        tokens,
        pools,
        positions,
        transactions,
        slippageSettings,
        portfolio,
        isWalletConnected: connected,
        connectWallet,
        disconnectWallet,
        updateSlippageSettings,
        refreshData,
        addTransaction,
      }}
    >
      {children}
    </AMMContext.Provider>
  );
}

export function useAMM() {
  const context = useContext(AMMContext);
  if (context === undefined) {
    throw new Error('useAMM must be used within an AMMProvider');
  }
  return context;
}
