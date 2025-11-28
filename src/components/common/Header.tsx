import { Link, useLocation } from 'react-router-dom';
import { useAMM } from '@/contexts/AMMContext';
import { Button } from '@/components/ui/button';
import { Wallet, Menu, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const { isWalletConnected, connectWallet, disconnectWallet } = useAMM();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Swap', path: '/swap' },
    { name: 'Pools', path: '/pools' },
    { name: 'Liquidity', path: '/liquidity' },
    { name: 'Positions', path: '/positions' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 backdrop-blur-neon">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full gradient-neon-bg flex items-center justify-center neon-glow-cyan transition-smooth group-hover:scale-110">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <span className="text-xl font-bold gradient-neon-text">
                Mint LP
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={
                      location.pathname === item.path ? "default" : "ghost"
                    }
                    className={`transition-smooth ${
                      location.pathname === item.path
                        ? "neon-glow-cyan"
                        : "hover:neon-border"
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isWalletConnected ? (
              <Button
                variant="outline"
                onClick={disconnectWallet}
                className="neon-border hover:neon-glow-cyan transition-smooth"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={connectWallet}
                className="neon-glow-cyan hover:neon-glow-purple transition-smooth"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="neon-border">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="backdrop-blur-neon border-border/50"
              >
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={
                          location.pathname === item.path ? "default" : "ghost"
                        }
                        className={`w-full justify-start transition-smooth ${
                          location.pathname === item.path
                            ? "neon-glow-cyan"
                            : "hover:neon-border"
                        }`}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
