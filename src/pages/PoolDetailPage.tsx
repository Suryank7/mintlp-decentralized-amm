import { useParams, useNavigate } from 'react-router-dom';
import { useAMM } from '@/contexts/AMMContext';
import { AMMath } from '@/services/ammMath';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Droplet, TrendingUp, Percent, Activity, Clock } from 'lucide-react';

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pools } = useAMM();

  const pool = pools.find(p => p.id === id);

  if (!pool) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="shadow-card neon-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Pool not found</p>
            <Button onClick={() => navigate('/pools')} className="mt-4 neon-glow-cyan">
              Back to Pools
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const reserveAValue = Number(AMMath.formatAmount(pool.reserveA, pool.tokenA.decimals)) * pool.tokenA.priceUSD;
  const reserveBValue = Number(AMMath.formatAmount(pool.reserveB, pool.tokenB.decimals)) * pool.tokenB.priceUSD;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate('/pools')}
        className="mb-6 neon-border hover:neon-glow-cyan transition-smooth"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pools
      </Button>

      <div className="space-y-6">
        <Card className="shadow-card neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-2">
                  <img
                    src={pool.tokenA.logoUrl}
                    alt={pool.tokenA.symbol}
                    className="w-12 h-12 rounded-full border-2 border-primary neon-glow-cyan"
                  />
                  <img
                    src={pool.tokenB.logoUrl}
                    alt={pool.tokenB.symbol}
                    className="w-12 h-12 rounded-full border-2 border-secondary neon-glow-magenta"
                  />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold gradient-neon-text">
                    {pool.tokenA.symbol}/{pool.tokenB.symbol}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="neon-border-secondary">
                      {(pool.feeTier * 100).toFixed(2)}% Fee
                    </Badge>
                    <Badge variant="outline" className="neon-border">
                      {pool.poolType === 'constant_product' ? 'Standard' : 'Stable'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/liquidity?pool=${pool.id}`)}
                  className="neon-glow-cyan hover:neon-glow-purple transition-smooth"
                >
                  Add Liquidity
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/swap?from=${pool.tokenA.id}&to=${pool.tokenB.id}`)}
                  className="neon-border hover:neon-glow-magenta transition-smooth"
                >
                  Swap
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card neon-border hover:neon-glow-cyan transition-smooth">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Total Value Locked</span>
                </div>
                <div className="text-2xl font-bold text-primary">{formatNumber(pool.tvl)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card neon-border-secondary hover:neon-glow-magenta transition-smooth">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Droplet className="w-4 h-4" />
                  <span>24h Volume</span>
                </div>
                <div className="text-2xl font-bold text-secondary">{formatNumber(pool.volume24h)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card neon-border hover:neon-glow-green transition-smooth">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>APR</span>
                </div>
                <div className="text-2xl font-bold text-success">{pool.apr.toFixed(2)}%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card neon-border-accent hover:neon-glow-purple transition-smooth">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>24h Fees</span>
                </div>
                <div className="text-2xl font-bold text-accent">{formatNumber(pool.fees24h)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-primary" />
                Pool Liquidity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg neon-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={pool.tokenA.logoUrl}
                      alt={pool.tokenA.symbol}
                      className="w-8 h-8 rounded-full border border-primary neon-glow-cyan"
                    />
                    <div>
                      <div className="font-medium text-primary">{pool.tokenA.symbol}</div>
                      <div className="text-sm text-muted-foreground">{pool.tokenA.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {AMMath.formatAmount(pool.reserveA, pool.tokenA.decimals)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${reserveAValue.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg neon-border-secondary">
                  <div className="flex items-center gap-3">
                    <img
                      src={pool.tokenB.logoUrl}
                      alt={pool.tokenB.symbol}
                      className="w-8 h-8 rounded-full border border-secondary neon-glow-magenta"
                    />
                    <div>
                      <div className="font-medium text-secondary">{pool.tokenB.symbol}</div>
                      <div className="text-sm text-muted-foreground">{pool.tokenB.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-secondary">
                      {AMMath.formatAmount(pool.reserveB, pool.tokenB.decimals)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${reserveBValue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Liquidity</span>
                  <span className="font-bold text-primary">{formatNumber(pool.tvl)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card neon-border-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Pool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fee Tier</span>
                  <span className="font-medium text-secondary">{(pool.feeTier * 100).toFixed(2)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pool Type</span>
                  <span className="font-medium text-accent">
                    {pool.poolType === 'constant_product' ? 'Constant Product' : 'StableSwap'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total LP Tokens</span>
                  <span className="font-medium text-success">
                    {AMMath.formatAmount(pool.totalLiquidity, 18)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                  <span className="font-medium text-primary">{formatNumber(pool.volume24h)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">24h Fees</span>
                  <span className="font-medium text-success">{formatNumber(pool.fees24h)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">7d Volume</span>
                  <span className="font-medium text-secondary">{formatNumber(pool.volume7d)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">APR</span>
                  <span className="font-medium text-success">{pool.apr.toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-accent" />
              Exchange Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg neon-border">
                <div className="text-sm text-muted-foreground mb-2">Current Rate</div>
                <div className="text-lg font-bold text-primary">
                  1 {pool.tokenA.symbol} = {(Number(AMMath.formatAmount(pool.reserveB, pool.tokenB.decimals)) / Number(AMMath.formatAmount(pool.reserveA, pool.tokenA.decimals))).toFixed(6)} {pool.tokenB.symbol}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg neon-border-secondary">
                <div className="text-sm text-muted-foreground mb-2">Inverse Rate</div>
                <div className="text-lg font-bold text-secondary">
                  1 {pool.tokenB.symbol} = {(Number(AMMath.formatAmount(pool.reserveA, pool.tokenA.decimals)) / Number(AMMath.formatAmount(pool.reserveB, pool.tokenB.decimals))).toFixed(6)} {pool.tokenA.symbol}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card neon-border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Pool Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pool ID</span>
                <span className="font-mono text-accent">{pool.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">{new Date(pool.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
