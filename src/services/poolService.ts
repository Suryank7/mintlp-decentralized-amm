import { Pool, Token, FeeTier, PoolType, PoolStatistics } from '@/types';
import { MOCK_POOLS, getPoolById, getPoolByTokenPair } from './mockData';
import { AMMath } from './ammMath';

export class PoolService {
  static getAllPools(): Pool[] {
    return MOCK_POOLS;
  }

  static getPool(poolId: string): Pool | undefined {
    return getPoolById(poolId);
  }

  static findPool(tokenA: Token, tokenB: Token, feeTier?: FeeTier): Pool | undefined {
    return getPoolByTokenPair(tokenA.id, tokenB.id, feeTier);
  }

  static createPool(
    tokenA: Token,
    tokenB: Token,
    amountA: string,
    amountB: string,
    feeTier: FeeTier,
    poolType: PoolType = PoolType.CONSTANT_PRODUCT
  ): Pool {
    const newPool: Pool = {
      id: `pool-${Date.now()}`,
      tokenA,
      tokenB,
      reserveA: amountA,
      reserveB: amountB,
      totalLiquidity: AMMath.sqrt(BigInt(amountA) * BigInt(amountB)).toString(),
      feeTier,
      poolType,
      volume24h: '0',
      volume7d: '0',
      fees24h: '0',
      tvl: this.calculateTVL(amountA, amountB, tokenA.priceUSD || 0, tokenB.priceUSD || 0),
      apr: 0,
      createdAt: Date.now(),
    };

    MOCK_POOLS.push(newPool);
    return newPool;
  }

  static calculateTVL(
    reserveA: string,
    reserveB: string,
    priceA: number,
    priceB: number
  ): string {
    const valueA = (Number(reserveA) / 1e9) * priceA;
    const valueB = (Number(reserveB) / 1e6) * priceB;
    return Math.floor(valueA + valueB).toString();
  }

  static getPoolPrice(pool: Pool): number {
    const reserveA = Number(pool.reserveA);
    const reserveB = Number(pool.reserveB);
    return reserveB / reserveA;
  }

  static getPoolStatistics(): PoolStatistics {
    const totalValueLocked = MOCK_POOLS.reduce(
      (sum, pool) => sum + Number(pool.tvl),
      0
    ).toString();

    const volume24h = MOCK_POOLS.reduce(
      (sum, pool) => sum + Number(pool.volume24h),
      0
    ).toString();

    const fees24h = MOCK_POOLS.reduce(
      (sum, pool) => sum + Number(pool.fees24h),
      0
    ).toString();

    return {
      totalValueLocked,
      volume24h,
      fees24h,
      transactions24h: 1247,
      uniqueUsers24h: 342,
    };
  }

  static updatePoolReserves(
    poolId: string,
    newReserveA: string,
    newReserveB: string
  ): void {
    const pool = getPoolById(poolId);
    if (!pool) return;

    const isValid = AMMath.verifyConstantProduct(
      pool.reserveA,
      pool.reserveB,
      newReserveA,
      newReserveB
    );

    if (!isValid) {
      throw new Error('Invalid reserves: constant product not maintained');
    }

    pool.reserveA = newReserveA;
    pool.reserveB = newReserveB;
  }

  static getPoolsByToken(tokenId: string): Pool[] {
    return MOCK_POOLS.filter(
      pool => pool.tokenA.id === tokenId || pool.tokenB.id === tokenId
    );
  }

  static sortPoolsByTVL(pools: Pool[]): Pool[] {
    return [...pools].sort((a, b) => Number(b.tvl) - Number(a.tvl));
  }

  static sortPoolsByAPR(pools: Pool[]): Pool[] {
    return [...pools].sort((a, b) => b.apr - a.apr);
  }

  static sortPoolsByVolume(pools: Pool[]): Pool[] {
    return [...pools].sort((a, b) => Number(b.volume24h) - Number(a.volume24h));
  }
}
