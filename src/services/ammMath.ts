import { FeeTier, PoolType } from '@/types';

export class AMMath {
  static calculateOutputAmount(
    inputAmount: string,
    reserveIn: string,
    reserveOut: string,
    feeTier: FeeTier
  ): string {
    const input = BigInt(inputAmount);
    const resIn = BigInt(reserveIn);
    const resOut = BigInt(reserveOut);
    
    const feeMultiplier = BigInt(Math.floor((1 - feeTier) * 10000));
    const inputWithFee = (input * feeMultiplier) / BigInt(10000);
    
    const numerator = inputWithFee * resOut;
    const denominator = resIn + inputWithFee;
    
    return (numerator / denominator).toString();
  }

  static calculateInputAmount(
    outputAmount: string,
    reserveIn: string,
    reserveOut: string,
    feeTier: FeeTier
  ): string {
    const output = BigInt(outputAmount);
    const resIn = BigInt(reserveIn);
    const resOut = BigInt(reserveOut);
    
    const feeMultiplier = BigInt(Math.floor((1 - feeTier) * 10000));
    
    const numerator = resIn * output * BigInt(10000);
    const denominator = (resOut - output) * feeMultiplier;
    
    return (numerator / denominator + BigInt(1)).toString();
  }

  static calculatePriceImpact(
    inputAmount: string,
    outputAmount: string,
    reserveIn: string,
    reserveOut: string
  ): number {
    const input = Number(inputAmount);
    const output = Number(outputAmount);
    const resIn = Number(reserveIn);
    const resOut = Number(reserveOut);
    
    const spotPrice = resOut / resIn;
    const executionPrice = output / input;
    
    const priceImpact = ((spotPrice - executionPrice) / spotPrice) * 100;
    return Math.abs(priceImpact);
  }

  static calculateLPTokensToMint(
    amountA: string,
    amountB: string,
    reserveA: string,
    reserveB: string,
    totalSupply: string
  ): string {
    if (totalSupply === '0') {
      const a = BigInt(amountA);
      const b = BigInt(amountB);
      return this.sqrt(a * b).toString();
    }
    
    const amtA = BigInt(amountA);
    const resA = BigInt(reserveA);
    const supply = BigInt(totalSupply);
    
    return ((amtA * supply) / resA).toString();
  }

  static calculateLiquidityAmounts(
    lpTokens: string,
    totalSupply: string,
    reserveA: string,
    reserveB: string
  ): { amountA: string; amountB: string } {
    const lp = BigInt(lpTokens);
    const supply = BigInt(totalSupply);
    const resA = BigInt(reserveA);
    const resB = BigInt(reserveB);
    
    const amountA = (lp * resA) / supply;
    const amountB = (lp * resB) / supply;
    
    return {
      amountA: amountA.toString(),
      amountB: amountB.toString(),
    };
  }

  static calculateOptimalAmountB(
    amountA: string,
    reserveA: string,
    reserveB: string
  ): string {
    const amtA = BigInt(amountA);
    const resA = BigInt(reserveA);
    const resB = BigInt(reserveB);
    
    return ((amtA * resB) / resA).toString();
  }

  static calculateSharePercentage(
    lpTokens: string,
    totalSupply: string
  ): number {
    const lp = Number(lpTokens);
    const supply = Number(totalSupply);
    
    if (supply === 0) return 0;
    return (lp / supply) * 100;
  }

  static calculateFees(
    inputAmount: string,
    feeTier: FeeTier
  ): string {
    const input = BigInt(inputAmount);
    const feeAmount = (input * BigInt(Math.floor(feeTier * 10000))) / BigInt(10000);
    return feeAmount.toString();
  }

  static calculateMinimumReceived(
    outputAmount: string,
    slippageTolerance: number
  ): string {
    const output = BigInt(outputAmount);
    const slippage = BigInt(Math.floor(slippageTolerance * 10000));
    const minReceived = (output * (BigInt(10000) - slippage)) / BigInt(10000);
    return minReceived.toString();
  }

  static calculateImpermanentLoss(
    priceRatio: number
  ): number {
    const sqrtRatio = Math.sqrt(priceRatio);
    const il = (2 * sqrtRatio) / (1 + priceRatio) - 1;
    return il * 100;
  }

  static calculateStableSwapOutput(
    inputAmount: string,
    reserveIn: string,
    reserveOut: string,
    amplificationCoefficient: number,
    feeTier: FeeTier
  ): string {
    const input = Number(inputAmount);
    const resIn = Number(reserveIn);
    const resOut = Number(reserveOut);
    const A = amplificationCoefficient;
    
    const fee = input * feeTier;
    const inputAfterFee = input - fee;
    
    const D = resIn + resOut;
    const newResIn = resIn + inputAfterFee;
    
    const Ann = A * 2;
    const c = (D * D * D) / (newResIn * 4 * Ann);
    const b = newResIn + D / Ann;
    
    let y = D;
    for (let i = 0; i < 255; i++) {
      const yPrev = y;
      y = (y * y + c) / (2 * y + b - D);
      if (Math.abs(y - yPrev) <= 1) break;
    }
    
    const output = resOut - y;
    return Math.floor(output).toString();
  }

  static sqrt(value: bigint): bigint {
    if (value < BigInt(0)) {
      throw new Error('Square root of negative numbers is not supported');
    }
    if (value < BigInt(2)) {
      return value;
    }

    let x = value;
    let y = (x + BigInt(1)) / BigInt(2);

    while (y < x) {
      x = y;
      y = (x + value / x) / BigInt(2);
    }

    return x;
  }

  static formatAmount(amount: string, decimals: number): string {
    const value = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    return `${integerPart}.${trimmedFractional}`;
  }

  static parseAmount(amount: string, decimals: number): string {
    const [integerPart, fractionalPart = ''] = amount.split('.');
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
    const fullAmount = integerPart + paddedFractional;
    return BigInt(fullAmount).toString();
  }

  static verifyConstantProduct(
    reserveA: string,
    reserveB: string,
    newReserveA: string,
    newReserveB: string
  ): boolean {
    const k1 = BigInt(reserveA) * BigInt(reserveB);
    const k2 = BigInt(newReserveA) * BigInt(newReserveB);
    return k2 >= k1;
  }
}
