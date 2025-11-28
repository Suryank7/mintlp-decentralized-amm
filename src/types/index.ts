export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  balance?: string;
  priceUSD?: number;
}

export enum PoolType {
  CONSTANT_PRODUCT = 'constant_product',
  STABLE_SWAP = 'stable_swap',
}

export enum FeeTier {
  LOW = 0.0005,
  MEDIUM = 0.003,
  HIGH = 0.01,
}

export interface Pool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  reserveA: string;
  reserveB: string;
  totalLiquidity: string;
  feeTier: FeeTier;
  poolType: PoolType;
  volume24h: string;
  volume7d: string;
  fees24h: string;
  tvl: string;
  apr: number;
  createdAt: number;
  amplificationCoefficient?: number;
}

export interface LPPosition {
  id: string;
  nftId: string;
  poolId: string;
  pool: Pool;
  lpTokens: string;
  sharePercentage: number;
  valueUSD: number;
  tokenAAmount: string;
  tokenBAmount: string;
  accumulatedFeesA: string;
  accumulatedFeesB: string;
  accumulatedFeesUSD: number;
  impermanentLoss: number;
  createdAt: number;
  lastUpdated: number;
}

export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  minimumReceived: string;
  fee: string;
  route: Pool[];
  executionPrice: number;
}

export interface Transaction {
  id: string;
  type: 'swap' | 'add_liquidity' | 'remove_liquidity' | 'claim_fees';
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  poolId?: string;
  tokenA?: Token;
  tokenB?: Token;
  amountA?: string;
  amountB?: string;
  hash?: string;
  error?: string;
}

export interface SlippageSettings {
  tolerance: number;
  deadline: number;
  autoSlippage: boolean;
}

export interface PoolStatistics {
  totalValueLocked: string;
  volume24h: string;
  fees24h: string;
  transactions24h: number;
  uniqueUsers24h: number;
}

export interface UserPortfolio {
  totalValueUSD: number;
  positions: LPPosition[];
  totalFeesEarnedUSD: number;
  totalImpermanentLoss: number;
}

export interface PriceChart {
  timestamp: number;
  price: number;
  volume: number;
}
