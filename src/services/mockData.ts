import { Token, Pool, PoolType, FeeTier, LPPosition } from '@/types';

export const MOCK_TOKENS: Token[] = [
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    decimals: 9,
    logoUrl: 'https://cryptologos.cc/logos/sui-sui-logo.png',
    balance: '1000000000000',
    priceUSD: 2.45,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: '5000000000',
    priceUSD: 1.0,
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    balance: '3000000000',
    priceUSD: 1.0,
  },
  {
    id: 'weth',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: '500000000000000000',
    priceUSD: 3200.0,
  },
  {
    id: 'wbtc',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoUrl: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    balance: '10000000',
    priceUSD: 65000.0,
  },
];

export const MOCK_POOLS: Pool[] = [
  {
    id: 'pool-1',
    tokenA: MOCK_TOKENS[0],
    tokenB: MOCK_TOKENS[1],
    reserveA: '100000000000000',
    reserveB: '245000000000',
    totalLiquidity: '15652475842',
    feeTier: FeeTier.MEDIUM,
    poolType: PoolType.CONSTANT_PRODUCT,
    volume24h: '1250000',
    volume7d: '8750000',
    fees24h: '3750',
    tvl: '490000',
    apr: 24.5,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'pool-2',
    tokenA: MOCK_TOKENS[1],
    tokenB: MOCK_TOKENS[2],
    reserveA: '500000000000',
    reserveB: '500000000000',
    totalLiquidity: '500000000000',
    feeTier: FeeTier.LOW,
    poolType: PoolType.STABLE_SWAP,
    volume24h: '2500000',
    volume7d: '17500000',
    fees24h: '1250',
    tvl: '1000000',
    apr: 12.8,
    createdAt: Date.now() - 86400000 * 60,
    amplificationCoefficient: 100,
  },
  {
    id: 'pool-3',
    tokenA: MOCK_TOKENS[0],
    tokenB: MOCK_TOKENS[3],
    reserveA: '200000000000000',
    reserveB: '153125000000000000',
    totalLiquidity: '17544071700',
    feeTier: FeeTier.MEDIUM,
    poolType: PoolType.CONSTANT_PRODUCT,
    volume24h: '3200000',
    volume7d: '22400000',
    fees24h: '9600',
    tvl: '980000',
    apr: 35.2,
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: 'pool-4',
    tokenA: MOCK_TOKENS[3],
    tokenB: MOCK_TOKENS[1],
    reserveA: '31250000000000000',
    reserveB: '100000000000',
    totalLiquidity: '5590169943',
    feeTier: FeeTier.MEDIUM,
    poolType: PoolType.CONSTANT_PRODUCT,
    volume24h: '850000',
    volume7d: '5950000',
    fees24h: '2550',
    tvl: '200000',
    apr: 45.6,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'pool-5',
    tokenA: MOCK_TOKENS[4],
    tokenB: MOCK_TOKENS[1],
    reserveA: '153846153',
    reserveB: '10000000000',
    totalLiquidity: '1240347',
    feeTier: FeeTier.HIGH,
    poolType: PoolType.CONSTANT_PRODUCT,
    volume24h: '450000',
    volume7d: '3150000',
    fees24h: '4500',
    tvl: '20000',
    apr: 82.5,
    createdAt: Date.now() - 86400000 * 15,
  },
];

export const MOCK_LP_POSITIONS: LPPosition[] = [
  {
    id: 'pos-1',
    nftId: 'nft-1',
    poolId: 'pool-1',
    pool: MOCK_POOLS[0],
    lpTokens: '1565247584',
    sharePercentage: 10.0,
    valueUSD: 49000,
    tokenAAmount: '10000000000000',
    tokenBAmount: '24500000000',
    accumulatedFeesA: '50000000000',
    accumulatedFeesB: '122500000',
    accumulatedFeesUSD: 245,
    impermanentLoss: -2.5,
    createdAt: Date.now() - 86400000 * 25,
    lastUpdated: Date.now(),
  },
  {
    id: 'pos-2',
    nftId: 'nft-2',
    poolId: 'pool-2',
    pool: MOCK_POOLS[1],
    lpTokens: '25000000000',
    sharePercentage: 5.0,
    valueUSD: 50000,
    tokenAAmount: '25000000000',
    tokenBAmount: '25000000000',
    accumulatedFeesA: '31250000',
    accumulatedFeesB: '31250000',
    accumulatedFeesUSD: 62.5,
    impermanentLoss: 0,
    createdAt: Date.now() - 86400000 * 50,
    lastUpdated: Date.now(),
  },
  {
    id: 'pos-3',
    nftId: 'nft-3',
    poolId: 'pool-3',
    pool: MOCK_POOLS[2],
    lpTokens: '877203585',
    sharePercentage: 5.0,
    valueUSD: 49000,
    tokenAAmount: '10000000000000',
    tokenBAmount: '7656250000000000',
    accumulatedFeesA: '75000000000',
    accumulatedFeesB: '574218750000000',
    accumulatedFeesUSD: 367.5,
    impermanentLoss: -1.8,
    createdAt: Date.now() - 86400000 * 40,
    lastUpdated: Date.now(),
  },
];

export function getTokenById(id: string): Token | undefined {
  return MOCK_TOKENS.find(token => token.id === id);
}

export function getPoolById(id: string): Pool | undefined {
  return MOCK_POOLS.find(pool => pool.id === id);
}

export function getPoolByTokenPair(tokenAId: string, tokenBId: string, feeTier?: FeeTier): Pool | undefined {
  return MOCK_POOLS.find(pool => {
    const matchesTokens = 
      (pool.tokenA.id === tokenAId && pool.tokenB.id === tokenBId) ||
      (pool.tokenA.id === tokenBId && pool.tokenB.id === tokenAId);
    
    if (feeTier !== undefined) {
      return matchesTokens && pool.feeTier === feeTier;
    }
    
    return matchesTokens;
  });
}

export function getUserPositions(): LPPosition[] {
  return MOCK_LP_POSITIONS;
}

export function getPositionById(id: string): LPPosition | undefined {
  return MOCK_LP_POSITIONS.find(pos => pos.id === id);
}
