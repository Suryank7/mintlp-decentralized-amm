import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from '@/constants/aptos';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Coins } from 'lucide-react';

const FaucetPage = () => {
  const { signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleMint = async () => {
    setIsLoading(true);
    try {
      const payload = {
        data: {
          function: `${MODULE_ADDRESS}::faucet::mint_test_tokens`,
          typeArguments: [],
          functionArguments: ["100000000"], // Mint 100 tokens (8 decimals)
        }
      } as InputTransactionData;
      
      const response = await signAndSubmitTransaction(payload);
      
      toast({
        title: "Tokens Minted!",
        description: `Successfully minted test tokens. Hash: ${response.hash.slice(0, 6)}...`,
        className: "neon-border bg-black/90 text-white",
      });
      
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Minting Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 gradient-neon-text text-center">Testnet Faucet</h1>
      
      <Card className="glass-panel border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Get Test Tokens</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Mint free mock tokens to test the AMM features. 
            You will receive 100 MKA and 100 MKB.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button 
            onClick={handleMint} 
            disabled={isLoading}
            className="w-full max-w-xs h-16 text-lg font-bold neon-glow-cyan hover:neon-glow-purple transition-smooth"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-6 w-6" />
                Mint 100 Tokens
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaucetPage;
