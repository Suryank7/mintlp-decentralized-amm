import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token, Pool, LPPosition, SlippageSettings, Transaction, UserPortfolio } from '@/types';
import { MOCK_TOKENS } from '@/services/mockData';
import { PoolService } from '@/services/poolService';
import { LiquidityService } from '@/services/liquidityService';

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
  const [tokens] = useState<Token[]>(MOCK_TOKENS);
  const [pools, setPools] = useState<Pool[]>([]);
  const [positions, setPositions] = useState<LPPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
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
    if (isWalletConnected) {
      updatePortfolio();
    }
  }, [positions, isWalletConnected]);

  const refreshData = () => {
    setPools(PoolService.getAllPools());
    
    if (isWalletConnected) {
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
    setIsWalletConnected(true);
    setPositions(LiquidityService.getAllPositions());
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setPositions([]);
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
        isWalletConnected,
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
