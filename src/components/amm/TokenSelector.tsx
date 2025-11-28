import { useState } from 'react';
import { Token } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Search } from 'lucide-react';
import { AMMath } from '@/services/ammMath';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken?: Token;
  onSelectToken: (token: Token) => void;
  label?: string;
  disabled?: boolean;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  label = 'Select Token',
  disabled = false,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(
    token =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedToken.logoUrl}
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold">{selectedToken.symbol}</span>
            </div>
          ) : (
            <span>{label}</span>
          )}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or symbol"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-1">
              {filteredTokens.map(token => (
                <button
                  key={token.id}
                  onClick={() => handleSelectToken(token)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={token.logoUrl}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  {token.balance && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {AMMath.formatAmount(token.balance, token.decimals)}
                      </div>
                      {token.priceUSD && (
                        <div className="text-xs text-muted-foreground">
                          ${(Number(AMMath.formatAmount(token.balance, token.decimals)) * token.priceUSD).toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
              {filteredTokens.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tokens found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
