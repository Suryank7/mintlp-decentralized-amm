import { useState, useEffect } from 'react';
import { Token, SwapQuote } from '@/types';
import { useAMM } from '@/contexts/AMMContext';
import { SwapService } from '@/services/swapService';
import { AMMath } from '@/services/ammMath';
import { TokenAmountInput } from '@/components/amm/TokenAmountInput';
import { SlippageSettings } from '@/components/amm/SlippageSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowDown, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SwapPage() {
  const { tokens, slippageSettings, updateSlippageSettings, isWalletConnected, connectWallet, addTransaction } = useAMM();
  const { toast } = useToast();

  const [inputToken, setInputToken] = useState<Token | undefined>(tokens[0]);
  const [outputToken, setOutputToken] = useState<Token | undefined>(tokens[1]);
  const [inputAmount, setInputAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (inputToken && outputToken && inputAmount && Number(inputAmount) > 0) {
      const swapQuote = SwapService.getSwapQuote(
        inputToken,
        outputToken,
        AMMath.parseAmount(inputAmount, inputToken.decimals),
        slippageSettings
      );
      setQuote(swapQuote);
    } else {
      setQuote(null);
    }
  }, [inputToken, outputToken, inputAmount, slippageSettings]);

  const handleSwapTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount('');
    setQuote(null);
  };

  const handleSwap = async () => {
    if (!quote || !isWalletConnected) return;

    setIsSwapping(true);

    const transaction = {
      id: `tx-${Date.now()}`,
      type: 'swap' as const,
      status: 'pending' as const,
      timestamp: Date.now(),
      tokenA: inputToken,
      tokenB: outputToken,
      amountA: inputAmount,
      amountB: AMMath.formatAmount(quote.outputAmount, outputToken!.decimals),
    };

    addTransaction(transaction);

    setTimeout(() => {
      const result = SwapService.executeSwap(quote, slippageSettings);

      if (result.success) {
        toast({
          title: 'Swap Successful',
          description: `Swapped ${inputAmount} ${inputToken?.symbol} for ${AMMath.formatAmount(quote.outputAmount, outputToken!.decimals)} ${outputToken?.symbol}`,
        });

        addTransaction({
          ...transaction,
          status: 'success',
          hash: result.hash,
        });

        setInputAmount('');
        setQuote(null);
      } else {
        toast({
          title: 'Swap Failed',
          description: result.error || 'Transaction failed',
          variant: 'destructive',
        });

        addTransaction({
          ...transaction,
          status: 'failed',
          error: result.error,
        });
      }

      setIsSwapping(false);
    }, 2000);
  };

  const priceImpactWarning = quote
    ? SwapService.calculatePriceImpactWarning(quote.priceImpact)
    : null;

  const availableTokens = tokens.filter(t => t.id !== inputToken?.id);
  const availableOutputTokens = tokens.filter(t => t.id !== outputToken?.id);

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Swap</CardTitle>
            <SlippageSettings
              settings={slippageSettings}
              onSettingsChange={updateSlippageSettings}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TokenAmountInput
            tokens={availableOutputTokens}
            selectedToken={inputToken}
            amount={inputAmount}
            onTokenSelect={setInputToken}
            onAmountChange={setInputAmount}
            label="You Pay"
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          <TokenAmountInput
            tokens={availableTokens}
            selectedToken={outputToken}
            amount={quote ? AMMath.formatAmount(quote.outputAmount, outputToken!.decimals) : ''}
            onTokenSelect={setOutputToken}
            onAmountChange={() => {}}
            label="You Receive"
            readOnly
            showBalance={false}
          />

          {quote && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">
                  1 {inputToken?.symbol} = {quote.executionPrice.toFixed(6)} {outputToken?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span
                  className={`font-medium ${
                    priceImpactWarning?.level === 'critical'
                      ? 'text-destructive'
                      : priceImpactWarning?.level === 'high'
                        ? 'text-warning'
                        : 'text-success'
                  }`}
                >
                  {quote.priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Received</span>
                <span className="font-medium">
                  {AMMath.formatAmount(quote.minimumReceived, outputToken!.decimals)} {outputToken?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">
                  {AMMath.formatAmount(quote.fee, inputToken!.decimals)} {inputToken?.symbol}
                </span>
              </div>
            </div>
          )}

          {priceImpactWarning && priceImpactWarning.level !== 'low' && (
            <Alert variant={priceImpactWarning.level === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{priceImpactWarning.message}</AlertDescription>
            </Alert>
          )}

          {!quote && inputToken && outputToken && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No liquidity pool found for this token pair
              </AlertDescription>
            </Alert>
          )}

          {!isWalletConnected ? (
            <Button onClick={connectWallet} className="w-full" size="lg">
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleSwap}
              disabled={!quote || isSwapping}
              className="w-full"
              size="lg"
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
