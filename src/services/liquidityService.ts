import { Token, Pool, LPPosition } from '@/types';
import { AMMath } from './ammMath';
import { PoolService } from './poolService';
import { MOCK_LP_POSITIONS } from './mockData';

export class LiquidityService {
  static addLiquidity(
    pool: Pool,
    amountA: string,
    amountB: string
  ): { position: LPPosition; lpTokens: string } {
    const optimalAmountB = AMMath.calculateOptimalAmountB(
      amountA,
      pool.reserveA,
      pool.reserveB
    );

    const actualAmountB = BigInt(amountB);
    const optimalB = BigInt(optimalAmountB);
    const tolerance = (optimalB * BigInt(50)) / BigInt(10000);

    if (actualAmountB < optimalB - tolerance || actualAmountB > optimalB + tolerance) {
      throw new Error('Amount B not within acceptable ratio (±0.5%)');
    }

    const lpTokens = AMMath.calculateLPTokensToMint(
      amountA,
      amountB,
      pool.reserveA,
      pool.reserveB,
      pool.totalLiquidity
    );

    const newReserveA = (BigInt(pool.reserveA) + BigInt(amountA)).toString();
    const newReserveB = (BigInt(pool.reserveB) + BigInt(amountB)).toString();
    const newTotalLiquidity = (BigInt(pool.totalLiquidity) + BigInt(lpTokens)).toString();

    pool.reserveA = newReserveA;
    pool.reserveB = newReserveB;
    pool.totalLiquidity = newTotalLiquidity;

    const sharePercentage = AMMath.calculateSharePercentage(
      lpTokens,
      newTotalLiquidity
    );

    const valueA = (Number(amountA) / Math.pow(10, pool.tokenA.decimals)) * (pool.tokenA.priceUSD || 0);
    const valueB = (Number(amountB) / Math.pow(10, pool.tokenB.decimals)) * (pool.tokenB.priceUSD || 0);
    const valueUSD = valueA + valueB;

    const position: LPPosition = {
      id: `pos-${Date.now()}`,
      nftId: `nft-${Date.now()}`,
      poolId: pool.id,
      pool,
      lpTokens,
      sharePercentage,
      valueUSD,
      tokenAAmount: amountA,
      tokenBAmount: amountB,
      accumulatedFeesA: '0',
      accumulatedFeesB: '0',
      accumulatedFeesUSD: 0,
      impermanentLoss: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    MOCK_LP_POSITIONS.push(position);

    return { position, lpTokens };
  }

  static removeLiquidity(
    position: LPPosition,
    lpTokensToRemove: string
  ): { amountA: string; amountB: string } {
    const pool = position.pool;

    if (BigInt(lpTokensToRemove) > BigInt(position.lpTokens)) {
      throw new Error('Insufficient LP tokens');
    }

    const amounts = AMMath.calculateLiquidityAmounts(
      lpTokensToRemove,
      pool.totalLiquidity,
      pool.reserveA,
      pool.reserveB
    );

    const newReserveA = (BigInt(pool.reserveA) - BigInt(amounts.amountA)).toString();
    const newReserveB = (BigInt(pool.reserveB) - BigInt(amounts.amountB)).toString();
    const newTotalLiquidity = (BigInt(pool.totalLiquidity) - BigInt(lpTokensToRemove)).toString();

    pool.reserveA = newReserveA;
    pool.reserveB = newReserveB;
    pool.totalLiquidity = newTotalLiquidity;

    const newLpTokens = (BigInt(position.lpTokens) - BigInt(lpTokensToRemove)).toString();
    position.lpTokens = newLpTokens;

    if (newLpTokens === '0') {
      const index = MOCK_LP_POSITIONS.findIndex(p => p.id === position.id);
      if (index !== -1) {
        MOCK_LP_POSITIONS.splice(index, 1);
      }
    } else {
      position.sharePercentage = AMMath.calculateSharePercentage(
        newLpTokens,
        newTotalLiquidity
      );
      position.lastUpdated = Date.now();
    }

    return amounts;
  }

  static calculatePositionValue(position: LPPosition): number {
    const pool = position.pool;
    
    const amounts = AMMath.calculateLiquidityAmounts(
      position.lpTokens,
      pool.totalLiquidity,
      pool.reserveA,
      pool.reserveB
    );

    const valueA = (Number(amounts.amountA) / Math.pow(10, pool.tokenA.decimals)) * (pool.tokenA.priceUSD || 0);
    const valueB = (Number(amounts.amountB) / Math.pow(10, pool.tokenB.decimals)) * (pool.tokenB.priceUSD || 0);

    return valueA + valueB;
  }

  static calculateImpermanentLoss(position: LPPosition): number {
    const pool = position.pool;
    
    const currentPrice = Number(pool.reserveB) / Number(pool.reserveA);
    const initialPrice = Number(position.tokenBAmount) / Number(position.tokenAAmount);
    
    const priceRatio = currentPrice / initialPrice;
    
    return AMMath.calculateImpermanentLoss(priceRatio);
  }

  static calculateAccumulatedFees(position: LPPosition): {
    feesA: string;
    feesB: string;
    feesUSD: number;
  } {
    const pool = position.pool;
    const sharePercentage = position.sharePercentage / 100;

    const totalFeesA = (BigInt(pool.fees24h) * BigInt(30) * BigInt(Math.floor(sharePercentage * 10000))) / BigInt(10000);
    const totalFeesB = (totalFeesA * BigInt(pool.reserveB)) / BigInt(pool.reserveA);

    const feesAValue = (Number(totalFeesA) / Math.pow(10, pool.tokenA.decimals)) * (pool.tokenA.priceUSD || 0);
    const feesBValue = (Number(totalFeesB) / Math.pow(10, pool.tokenB.decimals)) * (pool.tokenB.priceUSD || 0);

    return {
      feesA: totalFeesA.toString(),
      feesB: totalFeesB.toString(),
      feesUSD: feesAValue + feesBValue,
    };
  }

  static claimFees(position: LPPosition): {
    amountA: string;
    amountB: string;
    totalUSD: number;
  } {
    const fees = this.calculateAccumulatedFees(position);

    position.accumulatedFeesA = '0';
    position.accumulatedFeesB = '0';
    position.accumulatedFeesUSD = 0;
    position.lastUpdated = Date.now();

    return {
      amountA: fees.feesA,
      amountB: fees.feesB,
      totalUSD: fees.feesUSD,
    };
  }

  static updatePositionMetadata(position: LPPosition): void {
    position.valueUSD = this.calculatePositionValue(position);
    position.impermanentLoss = this.calculateImpermanentLoss(position);
    
    const fees = this.calculateAccumulatedFees(position);
    position.accumulatedFeesA = fees.feesA;
    position.accumulatedFeesB = fees.feesB;
    position.accumulatedFeesUSD = fees.feesUSD;
    
    position.lastUpdated = Date.now();
  }

  static getAllPositions(): LPPosition[] {
    MOCK_LP_POSITIONS.forEach(position => {
      this.updatePositionMetadata(position);
    });
    
    return MOCK_LP_POSITIONS;
  }

  static getPositionById(id: string): LPPosition | undefined {
    const position = MOCK_LP_POSITIONS.find(p => p.id === id);
    
    if (position) {
      this.updatePositionMetadata(position);
    }
    
    return position;
  }
}
