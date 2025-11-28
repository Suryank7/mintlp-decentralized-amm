import { useState } from 'react';
import { useAMM } from '@/contexts/AMMContext';
import { PoolService } from '@/services/poolService';
import { PoolCard } from '@/components/amm/PoolCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

export default function PoolsPage() {
  const { pools } = useAMM();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'tvl' | 'apr' | 'volume'>('tvl');

  const filteredPools = pools.filter(pool => {
    const searchLower = searchQuery.toLowerCase();
    return (
      pool.tokenA.symbol.toLowerCase().includes(searchLower) ||
      pool.tokenB.symbol.toLowerCase().includes(searchLower) ||
      pool.tokenA.name.toLowerCase().includes(searchLower) ||
      pool.tokenB.name.toLowerCase().includes(searchLower)
    );
  });

  const sortedPools =
    sortBy === 'tvl'
      ? PoolService.sortPoolsByTVL(filteredPools)
      : sortBy === 'apr'
        ? PoolService.sortPoolsByAPR(filteredPools)
        : PoolService.sortPoolsByVolume(filteredPools);

  const statistics = PoolService.getPoolStatistics();

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
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold gradient-neon-text mb-2">Liquidity Pools</h1>
          <p className="text-muted-foreground">
            Provide liquidity to earn trading fees and receive NFT-based LP positions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-gradient rounded-lg border p-6 neon-border hover:neon-glow-cyan transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">Total Value Locked</div>
            <div className="text-3xl font-bold text-primary">{formatNumber(statistics.totalValueLocked)}</div>
          </div>
          <div className="card-gradient rounded-lg border p-6 neon-border-secondary hover:neon-glow-magenta transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
            <div className="text-3xl font-bold text-secondary">{formatNumber(statistics.volume24h)}</div>
          </div>
          <div className="card-gradient rounded-lg border p-6 neon-border hover:neon-glow-green transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">24h Fees</div>
            <div className="text-3xl font-bold text-success">{formatNumber(statistics.fees24h)}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 neon-border"
            />
          </div>

          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as 'tvl' | 'apr' | 'volume')}>
            <TabsList className="neon-border">
              <TabsTrigger value="tvl">TVL</TabsTrigger>
              <TabsTrigger value="apr">APR</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPools.map(pool => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>

        {sortedPools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pools found</p>
          </div>
        )}
      </div>
    </div>
  );
}
