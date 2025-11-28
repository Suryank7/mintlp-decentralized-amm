import { useState, useEffect } from 'react';
import { Token, Pool, FeeTier } from '@/types';
import { useAMM } from '@/contexts/AMMContext';
import { PoolService } from '@/services/poolService';
import { LiquidityService } from '@/services/liquidityService';
import { AMMath } from '@/services/ammMath';
import { TokenAmountInput } from '@/components/amm/TokenAmountInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Minus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LiquidityPage() {
  const { tokens, isWalletConnected, connectWallet, refreshData } = useAMM();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [tokenA, setTokenA] = useState<Token | undefined>(tokens[0]);
  const [tokenB, setTokenB] = useState<Token | undefined>(tokens[1]);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [feeTier, setFeeTier] = useState<FeeTier>(FeeTier.MEDIUM);
  const [selectedPool, setSelectedPool] = useState<Pool | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (tokenA && tokenB) {
      const pool = PoolService.findPool(tokenA, tokenB, feeTier);
      setSelectedPool(pool);
    }
  }, [tokenA, tokenB, feeTier]);

  useEffect(() => {
    if (tokenA && tokenB && amountA && selectedPool) {
      const optimalB = AMMath.calculateOptimalAmountB(
        AMMath.parseAmount(amountA, tokenA.decimals),
        selectedPool.reserveA,
        selectedPool.reserveB
      );
      setAmountB(AMMath.formatAmount(optimalB, tokenB.decimals));
    }
  }, [amountA, tokenA, tokenB, selectedPool]);

  const handleAddLiquidity = async () => {
    if (!tokenA || !tokenB || !amountA || !amountB || !isWalletConnected) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        let pool = selectedPool;

        if (!pool) {
          pool = PoolService.createPool(
            tokenA,
            tokenB,
            AMMath.parseAmount(amountA, tokenA.decimals),
            AMMath.parseAmount(amountB, tokenB.decimals),
            feeTier
          );

          toast({
            title: 'Pool Created',
            description: `Created new ${tokenA.symbol}/${tokenB.symbol} pool`,
          });
        }

        const { position, lpTokens } = LiquidityService.addLiquidity(
          pool,
          AMMath.parseAmount(amountA, tokenA.decimals),
          AMMath.parseAmount(amountB, tokenB.decimals)
        );

        toast({
          title: 'Liquidity Added',
          description: `Added liquidity and received NFT position #${position.nftId.slice(-6)}`,
        });

        setAmountA('');
        setAmountB('');
        refreshData();
      } catch (error) {
        toast({
          title: 'Failed to Add Liquidity',
          description: error instanceof Error ? error.message : 'Transaction failed',
          variant: 'destructive',
        });
      }

      setIsProcessing(false);
    }, 2000);
  };

  const availableTokensB = tokens.filter(t => t.id !== tokenA?.id);
  const availableTokensA = tokens.filter(t => t.id !== tokenB?.id);

  const sharePercentage = selectedPool && amountA
    ? AMMath.calculateSharePercentage(
        AMMath.calculateLPTokensToMint(
          AMMath.parseAmount(amountA, tokenA!.decimals),
          AMMath.parseAmount(amountB, tokenB!.decimals),
          selectedPool.reserveA,
          selectedPool.reserveB,
          selectedPool.totalLiquidity
        ),
        selectedPool.totalLiquidity
      )
    : 0;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Liquidity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'add' | 'remove')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">
                <Plus className="w-4 h-4 mr-2" />
                Add Liquidity
              </TabsTrigger>
              <TabsTrigger value="remove">
                <Minus className="w-4 h-4 mr-2" />
                Remove Liquidity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fee Tier</label>
                <Select
                  value={feeTier.toString()}
                  onValueChange={(value) => setFeeTier(Number(value) as FeeTier)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FeeTier.LOW.toString()}>0.05% - Best for stable pairs</SelectItem>
                    <SelectItem value={FeeTier.MEDIUM.toString()}>0.30% - Most pairs</SelectItem>
                    <SelectItem value={FeeTier.HIGH.toString()}>1.00% - Exotic pairs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TokenAmountInput
                tokens={availableTokensB}
                selectedToken={tokenA}
                amount={amountA}
                onTokenSelect={setTokenA}
                onAmountChange={setAmountA}
                label="Token A"
              />

              <TokenAmountInput
                tokens={availableTokensA}
                selectedToken={tokenB}
                amount={amountB}
                onTokenSelect={setTokenB}
                onAmountChange={setAmountB}
                label="Token B"
              />

              {!selectedPool && tokenA && tokenB && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This pool doesn't exist yet. You'll create a new pool with your initial liquidity.
                  </AlertDescription>
                </Alert>
              )}

              {selectedPool && amountA && amountB && (
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">Position Details</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pool Share</span>
                      <span className="font-medium">{sharePercentage.toFixed(4)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-medium">
                        1 {tokenA?.symbol} = {(Number(amountB) / Number(amountA)).toFixed(6)} {tokenB?.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isWalletConnected ? (
                <Button onClick={connectWallet} className="w-full" size="lg">
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  onClick={handleAddLiquidity}
                  disabled={!tokenA || !tokenB || !amountA || !amountB || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Adding Liquidity...' : 'Add Liquidity'}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="remove" className="space-y-4 mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Go to the Positions page to manage and remove liquidity from your NFT positions.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => window.location.href = '/positions'}
                variant="outline"
                className="w-full"
                size="lg"
              >
                View My Positions
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
