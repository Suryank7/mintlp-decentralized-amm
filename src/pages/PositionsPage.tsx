import { useAMM } from '@/contexts/AMMContext';
import { LiquidityService } from '@/services/liquidityService';
import { NFTPositionCard } from '@/components/amm/NFTPositionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function PositionsPage() {
  const { positions, isWalletConnected, connectWallet, portfolio, refreshData } = useAMM();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClaimFees = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    const fees = LiquidityService.claimFees(position);

    toast({
      title: 'Fees Claimed',
      description: `Claimed ${fees.totalUSD.toFixed(2)} USD in fees`,
    });

    refreshData();
  };

  const formatUSD = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!isWalletConnected) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-card neon-border">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <Wallet className="w-16 h-16 text-primary neon-glow-cyan" />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold gradient-neon-text">Connect Your Wallet</h2>
                <p className="text-muted-foreground">
                  Connect your wallet to view your LP positions
                </p>
              </div>
              <Button onClick={connectWallet} size="lg" className="neon-glow-cyan hover:neon-glow-purple transition-smooth">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-neon-text mb-2">My Positions</h1>
            <p className="text-muted-foreground">
              Manage your NFT-based liquidity provider positions
            </p>
          </div>
          <Button onClick={() => navigate('/liquidity')} size="lg" className="neon-glow-cyan hover:neon-glow-purple transition-smooth">
            <Plus className="w-4 h-4 mr-2" />
            Add Liquidity
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-gradient rounded-lg border p-6 neon-border hover:neon-glow-cyan transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">Total Value</div>
            <div className="text-3xl font-bold text-primary">{formatUSD(portfolio.totalValueUSD)}</div>
          </div>
          <div className="card-gradient rounded-lg border p-6 neon-border hover:neon-glow-green transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">Total Fees Earned</div>
            <div className="text-3xl font-bold text-success">
              {formatUSD(portfolio.totalFeesEarnedUSD)}
            </div>
          </div>
          <div className="card-gradient rounded-lg border p-6 neon-border-secondary hover:neon-glow-magenta transition-smooth">
            <div className="text-sm text-muted-foreground mb-1">Impermanent Loss</div>
            <div
              className={`text-3xl font-bold ${
                portfolio.totalImpermanentLoss < 0 ? 'text-destructive' : 'text-success'
              }`}
            >
              {portfolio.totalImpermanentLoss.toFixed(2)}%
            </div>
          </div>
        </div>

        {positions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {positions.map(position => (
              <NFTPositionCard
                key={position.id}
                position={position}
                onClaimFees={() => handleClaimFees(position.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="shadow-card neon-border">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold gradient-neon-text">No Positions Yet</h2>
                <p className="text-muted-foreground">
                  Add liquidity to a pool to create your first NFT position
                </p>
              </div>
              <Button onClick={() => navigate('/liquidity')} size="lg" className="neon-glow-cyan hover:neon-glow-purple transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Add Liquidity
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
