import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAMM } from '@/contexts/AMMContext';
import { LiquidityService } from '@/services/liquidityService';
import { AMMath } from '@/services/ammMath';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Coins, TrendingDown, DollarSign, Percent, Clock, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PositionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { positions, refreshData } = useAMM();
  const { toast } = useToast();

  const position = positions.find(p => p.nftId === id);
  const [removePercentage, setRemovePercentage] = useState('100');
  const [isRemoving, setIsRemoving] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!position) {
      navigate('/positions');
    }
  }, [position, navigate]);

  if (!position) {
    return null;
  }

  const handleClaimFees = async () => {
    setIsClaiming(true);

    setTimeout(() => {
      try {
        LiquidityService.claimFees(position);

        toast({
          title: 'Fees Claimed',
          description: `Successfully claimed ${AMMath.formatAmount(position.accumulatedFeesA, position.pool.tokenA.decimals)} ${position.pool.tokenA.symbol} and ${AMMath.formatAmount(position.accumulatedFeesB, position.pool.tokenB.decimals)} ${position.pool.tokenB.symbol}`,
        });

        refreshData();
      } catch (error) {
        toast({
          title: 'Failed to Claim Fees',
          description: error instanceof Error ? error.message : 'Transaction failed',
          variant: 'destructive',
        });
      }

      setIsClaiming(false);
    }, 2000);
  };

  const handleRemoveLiquidity = async () => {
    const percentage = Number(removePercentage);
    if (percentage <= 0 || percentage > 100) {
      toast({
        title: 'Invalid Percentage',
        description: 'Please enter a value between 1 and 100',
        variant: 'destructive',
      });
      return;
    }

    setIsRemoving(true);

    setTimeout(() => {
      try {
        const lpTokensToRemove = (BigInt(position.lpTokens) * BigInt(percentage)) / 100n;

        const { amountA, amountB } = LiquidityService.removeLiquidity(
          position,
          lpTokensToRemove.toString()
        );

        toast({
          title: 'Liquidity Removed',
          description: `Removed ${AMMath.formatAmount(amountA, position.pool.tokenA.decimals)} ${position.pool.tokenA.symbol} and ${AMMath.formatAmount(amountB, position.pool.tokenB.decimals)} ${position.pool.tokenB.symbol}`,
        });

        refreshData();

        if (percentage === 100) {
          navigate('/positions');
        }
      } catch (error) {
        toast({
          title: 'Failed to Remove Liquidity',
          description: error instanceof Error ? error.message : 'Transaction failed',
          variant: 'destructive',
        });
      }

      setIsRemoving(false);
    }, 2000);
  };

  const totalFeesUSD = Number(AMMath.formatAmount(position.accumulatedFeesA, position.pool.tokenA.decimals)) * position.pool.tokenA.priceUSD +
    Number(AMMath.formatAmount(position.accumulatedFeesB, position.pool.tokenB.decimals)) * position.pool.tokenB.priceUSD;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate('/positions')}
        className="mb-6 neon-border hover:neon-glow-cyan transition-smooth"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Positions
      </Button>

      <div className="space-y-6">
        <Card className="shadow-card neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold gradient-neon-text">
                  {position.pool.tokenA.symbol}/{position.pool.tokenB.symbol} Position
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  NFT ID: {position.nftId.slice(0, 8)}...{position.nftId.slice(-6)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center neon-glow-cyan">
                  <span className="text-sm font-bold text-primary">{position.pool.tokenA.symbol.slice(0, 1)}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center neon-glow-magenta">
                  <span className="text-sm font-bold text-secondary">{position.pool.tokenB.symbol.slice(0, 1)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Position Value</span>
                </div>
                <div className="text-2xl font-bold text-primary">${position.valueUSD.toFixed(2)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Percent className="w-4 h-4" />
                  <span>Pool Share</span>
                </div>
                <div className="text-2xl font-bold text-secondary">{position.sharePercentage.toFixed(4)}%</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4" />
                  <span>Fees Earned</span>
                </div>
                <div className="text-2xl font-bold text-success">${totalFeesUSD.toFixed(2)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="w-4 h-4" />
                  <span>Impermanent Loss</span>
                </div>
                <div className={`text-2xl font-bold ${position.impermanentLoss < 0 ? 'text-destructive' : 'text-success'}`}>
                  {position.impermanentLoss.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg neon-border">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Liquidity</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{position.pool.tokenA.symbol}</span>
                    <span className="font-medium text-primary">
                      {AMMath.formatAmount(position.tokenAAmount, position.pool.tokenA.decimals)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{position.pool.tokenB.symbol}</span>
                    <span className="font-medium text-secondary">
                      {AMMath.formatAmount(position.tokenBAmount, position.pool.tokenB.decimals)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Unclaimed Fees</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{position.pool.tokenA.symbol}</span>
                    <span className="font-medium text-success">
                      {AMMath.formatAmount(position.accumulatedFeesA, position.pool.tokenA.decimals)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{position.pool.tokenB.symbol}</span>
                    <span className="font-medium text-success">
                      {AMMath.formatAmount(position.accumulatedFeesB, position.pool.tokenB.decimals)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Created: {new Date(position.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card neon-border hover:neon-glow-green transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Coins className="w-5 h-5" />
                Claim Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Droplet className="h-4 w-4" />
                <AlertDescription>
                  Claim your accumulated trading fees. Fees are automatically compounded if not claimed.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleClaimFees}
                disabled={isClaiming || (position.accumulatedFeesA === '0' && position.accumulatedFeesB === '0')}
                className="w-full neon-glow-green hover:neon-glow-cyan transition-smooth"
              >
                {isClaiming ? 'Claiming...' : 'Claim Fees'}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card neon-border-secondary hover:neon-glow-magenta transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <TrendingDown className="w-5 h-5" />
                Remove Liquidity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage to Remove</Label>
                <div className="flex gap-2">
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={removePercentage}
                    onChange={(e) => setRemovePercentage(e.target.value)}
                    className="neon-border"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setRemovePercentage('25')}
                    className="neon-border hover:neon-glow-cyan transition-smooth"
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRemovePercentage('50')}
                    className="neon-border hover:neon-glow-cyan transition-smooth"
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRemovePercentage('100')}
                    className="neon-border hover:neon-glow-cyan transition-smooth"
                  >
                    MAX
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  {removePercentage === '100'
                    ? 'Removing 100% will burn your NFT position.'
                    : `You will receive ${removePercentage}% of your liquidity.`}
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleRemoveLiquidity}
                disabled={isRemoving}
                variant="destructive"
                className="w-full neon-glow-magenta hover:neon-glow-purple transition-smooth"
              >
                {isRemoving ? 'Removing...' : 'Remove Liquidity'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
