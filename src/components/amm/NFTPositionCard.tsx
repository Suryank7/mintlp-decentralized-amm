import { LPPosition } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AMMath } from '@/services/ammMath';
import { Coins, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NFTPositionCardProps {
  position: LPPosition;
  onClaimFees?: () => void;
}

export function NFTPositionCard({ position, onClaimFees }: NFTPositionCardProps) {
  const navigate = useNavigate();

  const formatAmount = (amount: string, decimals: number) => {
    return Number(AMMath.formatAmount(amount, decimals)).toFixed(4);
  };

  const formatUSD = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card className="shadow-card hover:shadow-glow transition-smooth neon-border hover:neon-glow-cyan cursor-pointer" onClick={() => navigate(`/positions/${position.nftId}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              <img
                src={position.pool.tokenA.logoUrl}
                alt={position.pool.tokenA.symbol}
                className="w-8 h-8 rounded-full border-2 border-primary neon-glow-cyan"
              />
              <img
                src={position.pool.tokenB.logoUrl}
                alt={position.pool.tokenB.symbol}
                className="w-8 h-8 rounded-full border-2 border-secondary neon-glow-magenta"
              />
            </div>
            <span className="font-bold gradient-text">
              {position.pool.tokenA.symbol}/{position.pool.tokenB.symbol}
            </span>
          </CardTitle>
          <Badge variant="secondary" className="font-mono neon-border-secondary">
            #{position.nftId.slice(-6)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>Position Value</span>
            </div>
            <div className="text-xl font-bold text-primary">{formatUSD(position.valueUSD)}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3" />
              <span>Pool Share</span>
            </div>
            <div className="text-xl font-bold text-secondary">{position.sharePercentage.toFixed(4)}%</div>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-muted/50 rounded-lg neon-border">
          <div className="text-sm font-medium">Liquidity</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{position.pool.tokenA.symbol}</span>
              <span className="font-medium text-primary">
                {formatAmount(position.tokenAAmount, position.pool.tokenA.decimals)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{position.pool.tokenB.symbol}</span>
              <span className="font-medium text-secondary">
                {formatAmount(position.tokenBAmount, position.pool.tokenB.decimals)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-success/10 rounded-lg border border-success/20 neon-glow-green">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-success">Accumulated Fees</div>
            <div className="text-lg font-bold text-success">
              {formatUSD(position.accumulatedFeesUSD)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{position.pool.tokenA.symbol}</span>
              <span className="font-medium">
                {formatAmount(position.accumulatedFeesA, position.pool.tokenA.decimals)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{position.pool.tokenB.symbol}</span>
              <span className="font-medium">
                {formatAmount(position.accumulatedFeesB, position.pool.tokenB.decimals)}
              </span>
            </div>
          </div>
        </div>

        {position.impermanentLoss !== 0 && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded neon-border">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {position.impermanentLoss < 0 ? (
                <TrendingDown className="w-4 h-4 text-destructive" />
              ) : (
                <TrendingUp className="w-4 h-4 text-success" />
              )}
              <span>Impermanent Loss</span>
            </div>
            <span
              className={`text-sm font-semibold ${
                position.impermanentLoss < 0 ? 'text-destructive' : 'text-success'
              }`}
            >
              {position.impermanentLoss.toFixed(2)}%
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 neon-glow-green hover:neon-glow-cyan transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              onClaimFees?.();
            }}
            disabled={position.accumulatedFeesUSD === 0}
          >
            Claim Fees
          </Button>
          <Button
            variant="outline"
            className="flex-1 neon-border hover:neon-glow-magenta transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/positions/${position.nftId}`);
            }}
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
