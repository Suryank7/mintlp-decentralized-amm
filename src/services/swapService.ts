import { Token, Pool, SwapQuote, SlippageSettings } from '@/types';
import { AMMath } from './ammMath';
import { PoolService } from './poolService';
import { MODULE_ADDRESS } from '@/constants/aptos';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export class SwapService {
  static getSwapTransactionPayload(
    quote: SwapQuote,
    _slippageSettings: SlippageSettings
  ): InputTransactionData {
    const pool = quote.route[0];
    const isTokenAInput = pool.tokenA.id === quote.inputToken.id;
    
    // In a real app, IDs would be full struct tags like "0x1::aptos_coin::AptosCoin"
    // For now we assume the ID property holds this or needs mapping
    
    return {
      data: {
        function: `${MODULE_ADDRESS}::liquidity_pool::swap`,
        typeArguments: [pool.tokenA.id, pool.tokenB.id], 
        functionArguments: [
          quote.inputAmount,
          quote.minimumReceived,
          isTokenAInput
        ]
      }
    };
  }

  static getSwapQuote(
    inputToken: Token,
    outputToken: Token,
    inputAmount: string,
    slippageSettings: SlippageSettings
  ): SwapQuote | null {
    const pool = PoolService.findPool(inputToken, outputToken);
    
    if (!pool) {
      return null;
    }

    const isTokenAInput = pool.tokenA.id === inputToken.id;
    const reserveIn = isTokenAInput ? pool.reserveA : pool.reserveB;
    const reserveOut = isTokenAInput ? pool.reserveB : pool.reserveA;

    let outputAmount: string;
    
    if (pool.poolType === 'stable_swap' && pool.amplificationCoefficient) {
      outputAmount = AMMath.calculateStableSwapOutput(
        inputAmount,
        reserveIn,
        reserveOut,
        pool.amplificationCoefficient,
        pool.feeTier
      );
    } else {
      outputAmount = AMMath.calculateOutputAmount(
        inputAmount,
        reserveIn,
        reserveOut,
        pool.feeTier
      );
    }

    const priceImpact = AMMath.calculatePriceImpact(
      inputAmount,
      outputAmount,
      reserveIn,
      reserveOut
    );

    const minimumReceived = AMMath.calculateMinimumReceived(
      outputAmount,
      slippageSettings.tolerance
    );

    const fee = AMMath.calculateFees(inputAmount, pool.feeTier);

    const executionPrice = Number(outputAmount) / Number(inputAmount);

    return {
      inputToken,
      outputToken,
      inputAmount,
      outputAmount,
      priceImpact,
      minimumReceived,
      fee,
      route: [pool],
      executionPrice,
    };
  }

  static executeSwap(
    quote: SwapQuote,
    _slippageSettings: SlippageSettings
  ): { success: boolean; hash?: string; error?: string } {
    try {
      const pool = quote.route[0];
      
      if (Number(quote.outputAmount) < Number(quote.minimumReceived)) {
        return {
          success: false,
          error: 'Output amount below minimum received',
        };
      }

      const isTokenAInput = pool.tokenA.id === quote.inputToken.id;
      
      const newReserveIn = isTokenAInput
        ? (BigInt(pool.reserveA) + BigInt(quote.inputAmount)).toString()
        : (BigInt(pool.reserveB) + BigInt(quote.inputAmount)).toString();
      
      const newReserveOut = isTokenAInput
        ? (BigInt(pool.reserveB) - BigInt(quote.outputAmount)).toString()
        : (BigInt(pool.reserveA) - BigInt(quote.outputAmount)).toString();

      const newReserveA = isTokenAInput ? newReserveIn : newReserveOut;
      const newReserveB = isTokenAInput ? newReserveOut : newReserveIn;

      PoolService.updatePoolReserves(pool.id, newReserveA, newReserveB);

      const hash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

      return {
        success: true,
        hash,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap failed',
      };
    }
  }

  static findBestRoute(
    inputToken: Token,
    outputToken: Token,
    _inputAmount: string
  ): Pool[] {
    const directPool = PoolService.findPool(inputToken, outputToken);
    
    if (directPool) {
      return [directPool];
    }

    return [];
  }

  static calculatePriceImpactWarning(priceImpact: number): {
    level: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  } {
    if (priceImpact < 1) {
      return {
        level: 'low',
        message: 'Low price impact',
      };
    } else if (priceImpact < 3) {
      return {
        level: 'medium',
        message: 'Moderate price impact',
      };
    } else if (priceImpact < 5) {
      return {
        level: 'high',
        message: 'High price impact',
      };
    } else {
      return {
        level: 'critical',
        message: 'Critical price impact - consider reducing amount',
      };
    }
  }

  static reverseQuote(
    inputToken: Token,
    outputToken: Token,
    outputAmount: string,
    slippageSettings: SlippageSettings
  ): SwapQuote | null {
    const pool = PoolService.findPool(inputToken, outputToken);
    
    if (!pool) {
      return null;
    }

    const isTokenAInput = pool.tokenA.id === inputToken.id;
    const reserveIn = isTokenAInput ? pool.reserveA : pool.reserveB;
    const reserveOut = isTokenAInput ? pool.reserveB : pool.reserveA;

    const inputAmount = AMMath.calculateInputAmount(
      outputAmount,
      reserveIn,
      reserveOut,
      pool.feeTier
    );

    return this.getSwapQuote(inputToken, outputToken, inputAmount, slippageSettings);
  }
}
