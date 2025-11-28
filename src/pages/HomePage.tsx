import { useAMM } from '@/contexts/AMMContext';
import { PoolService } from '@/services/poolService';
import { PoolCard } from '@/components/amm/PoolCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Coins, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { pools } = useAMM();
  const navigate = useNavigate();

  const statistics = PoolService.getPoolStatistics();
  const topPools = PoolService.sortPoolsByTVL(pools).slice(0, 3);

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-12">
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Decentralized AMM
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trade, provide liquidity, and earn fees with NFT-based LP positions on SUI blockchain
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/swap')}>
              Start Trading
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/liquidity')}>
              Add Liquidity
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Value Locked</div>
                  <div className="text-2xl font-bold">{formatNumber(statistics.totalValueLocked)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Coins className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                  <div className="text-2xl font-bold">{formatNumber(statistics.volume24h)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Fees</div>
                  <div className="text-2xl font-bold">{formatNumber(statistics.fees24h)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Transactions</div>
                  <div className="text-2xl font-bold">{statistics.transactions24h}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Top Pools</h2>
              <p className="text-muted-foreground">Highest TVL liquidity pools</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/pools')}>
              View All Pools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {topPools.map(pool => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">NFT-Based Positions</h3>
                <p className="text-muted-foreground">
                  Your liquidity positions are represented as NFTs with full metadata and transferable ownership
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-4">
              <div className="p-3 rounded-lg bg-secondary/10 w-fit">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Slippage Protection</h3>
                <p className="text-muted-foreground">
                  Advanced slippage protection ensures you get the best possible rates with transparent price impact
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-4">
              <div className="p-3 rounded-lg bg-success/10 w-fit">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Earn Trading Fees</h3>
                <p className="text-muted-foreground">
                  Provide liquidity and earn a share of trading fees proportional to your pool contribution
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
