import { Token } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TokenSelector } from './TokenSelector';
import { AMMath } from '@/services/ammMath';

interface TokenAmountInputProps {
  tokens: Token[];
  selectedToken?: Token;
  amount: string;
  onTokenSelect: (token: Token) => void;
  onAmountChange: (amount: string) => void;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showBalance?: boolean;
}

export function TokenAmountInput({
  tokens,
  selectedToken,
  amount,
  onTokenSelect,
  onAmountChange,
  label,
  disabled = false,
  readOnly = false,
  showBalance = true,
}: TokenAmountInputProps) {
  const handleMaxClick = () => {
    if (selectedToken?.balance) {
      const formattedBalance = AMMath.formatAmount(
        selectedToken.balance,
        selectedToken.decimals
      );
      onAmountChange(formattedBalance);
    }
  };

  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  const formattedBalance = selectedToken?.balance
    ? AMMath.formatAmount(selectedToken.balance, selectedToken.decimals)
    : '0';

  const balanceUSD = selectedToken?.priceUSD
    ? (Number(formattedBalance) * selectedToken.priceUSD).toFixed(2)
    : '0.00';

  const amountUSD = selectedToken?.priceUSD && amount
    ? (Number(amount) * selectedToken.priceUSD).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="card-gradient rounded-lg border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              placeholder="0.0"
              disabled={disabled}
              readOnly={readOnly}
              className="text-2xl font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {amount && selectedToken && (
              <div className="text-sm text-muted-foreground mt-1">
                ≈ ${amountUSD}
              </div>
            )}
          </div>
          <div className="w-40">
            <TokenSelector
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={onTokenSelect}
              disabled={disabled}
            />
          </div>
        </div>
        {showBalance && selectedToken && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Balance: {formattedBalance} {selectedToken.symbol}
            </span>
            {selectedToken.priceUSD && (
              <span className="text-muted-foreground">≈ ${balanceUSD}</span>
            )}
            {!readOnly && !disabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="h-6 px-2 text-primary hover:text-primary"
              >
                MAX
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
