import { Pool } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Droplet, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PoolCardProps {
  pool: Pool;
}

export function PoolCard({ pool }: PoolCardProps) {
  const navigate = useNavigate();

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const getFeeTierLabel = (feeTier: number) => {
    return `${(feeTier * 100).toFixed(2)}%`;
  };

  const getPoolTypeLabel = (poolType: string) => {
    return poolType === 'constant_product' ? 'Standard' : 'Stable';
  };

  return (
    <Card className="shadow-card hover:shadow-glow transition-smooth cursor-pointer neon-border hover:neon-glow-cyan" onClick={() => navigate(`/pools/${pool.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              <img
                src={pool.tokenA.logoUrl}
                alt={pool.tokenA.symbol}
                className="w-8 h-8 rounded-full border-2 border-primary neon-glow-cyan"
              />
              <img
                src={pool.tokenB.logoUrl}
                alt={pool.tokenB.symbol}
                className="w-8 h-8 rounded-full border-2 border-secondary neon-glow-magenta"
              />
            </div>
            <span className="font-bold gradient-text">
              {pool.tokenA.symbol}/{pool.tokenB.symbol}
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="neon-border-secondary">{getFeeTierLabel(pool.feeTier)}</Badge>
            <Badge variant="outline" className="neon-border">{getPoolTypeLabel(pool.poolType)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>TVL</span>
            </div>
            <div className="text-lg font-semibold text-primary">{formatNumber(pool.tvl)}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Droplet className="w-3 h-3" />
              <span>Volume 24h</span>
            </div>
            <div className="text-lg font-semibold text-secondary">{formatNumber(pool.volume24h)}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>APR</span>
            </div>
            <div className="text-lg font-semibold text-success">{pool.apr.toFixed(2)}%</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 neon-glow-cyan hover:neon-glow-purple transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/liquidity?pool=${pool.id}`);
            }}
          >
            Add Liquidity
          </Button>
          <Button
            variant="outline"
            className="flex-1 neon-border hover:neon-glow-magenta transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/swap?from=${pool.tokenA.id}&to=${pool.tokenB.id}`);
            }}
          >
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
