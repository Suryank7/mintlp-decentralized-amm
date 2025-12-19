
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAMM } from '@/contexts/AMMContext';
import { Wallet } from 'lucide-react';

export function WelcomeDialog() {
  const { isWalletConnected, connectWallet } = useAMM();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show on mount if not connected
    if (!isWalletConnected) {
      setIsOpen(true);
    }
  }, [isWalletConnected]);

  const handleConnect = () => {
    connectWallet();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <DialogHeader>
          <div className="mx-auto bg-cyan-500/20 p-3 rounded-full mb-4 w-fit neon-border">
            <Wallet className="w-8 h-8 text-cyan-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Welcome to MintLP
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300 pt-2">
            Experience the future of DeFi liquidity with **NFT-based Positions** and **Dual-Engine Swaps**.
            <br/><br/>
            Connect your wallet to start trading, or explore in read-only mode.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              onClick={handleConnect}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg border-none"
            >
              Connect Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              Explore Mode
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
