# Decentralized AMM with NFT-based LP Positions

## Project Overview

This is a comprehensive web application demonstrating a **Decentralized Automated Market Maker (AMM)** with NFT-based liquidity provider positions. The application showcases all the core functionality of a modern DeFi AMM protocol, including token swaps, liquidity provision, fee distribution, and NFT-based position management.

### Key Features

- **Token Swapping**: Execute token swaps with real-time price calculations and slippage protection
- **Liquidity Provision**: Add liquidity to pools and receive NFT-based LP positions
- **NFT Positions**: Each liquidity position is represented as an NFT with full metadata
- **Fee Distribution**: Earn trading fees proportional to your pool share
- **Slippage Protection**: Advanced slippage settings with automatic and manual modes
- **Multiple Pool Types**: Support for both constant-product and StableSwap pools
- **Real-time Analytics**: Track pool statistics, TVL, volume, and APR

## Technical Architecture

### Core Components

#### 1. AMM Mathematical Engine (`src/services/ammMath.ts`)

Implements the core AMM formulas:
- **Constant Product Formula**: `x * y = k`
- **Swap Calculations**: Output amount with fee deduction
- **Price Impact**: Real-time price impact calculation
- **LP Token Minting**: Geometric mean for initial liquidity, proportional for subsequent additions
- **Slippage Protection**: Minimum received amount calculation
- **StableSwap**: Amplification coefficient-based calculations for stable pairs

#### 2. Service Layer

- **PoolService** (`src/services/poolService.ts`): Pool management and statistics
- **SwapService** (`src/services/swapService.ts`): Swap execution and quote generation
- **LiquidityService** (`src/services/liquidityService.ts`): Add/remove liquidity operations
- **MockData** (`src/services/mockData.ts`): Sample tokens and pools for demonstration

#### 3. State Management

- **AMMContext** (`src/contexts/AMMContext.tsx`): Global state management using React Context
  - Wallet connection state
  - Token and pool data
  - User positions and portfolio
  - Transaction history
  - Slippage settings

#### 4. UI Components

**Core Components** (`src/components/amm/`):
- `TokenSelector`: Token selection dialog with search
- `TokenAmountInput`: Amount input with token selection and balance display
- `PoolCard`: Pool information card with statistics
- `NFTPositionCard`: LP position display with fee tracking
- `SlippageSettings`: Slippage tolerance and deadline configuration

**Pages** (`src/pages/`):
- `HomePage`: Landing page with protocol statistics and top pools
- `SwapPage`: Token swap interface with price impact warnings
- `PoolsPage`: Browse and filter all liquidity pools
- `LiquidityPage`: Add liquidity to pools or create new ones
- `PositionsPage`: Manage NFT-based LP positions and claim fees

### Design System

The application uses a modern DeFi-themed design with:
- **Primary Color**: Cyan blue (`hsl(199 89% 48%)`)
- **Secondary Color**: Purple (`hsl(280 65% 60%)`)
- **Success Color**: Green for positive metrics
- **Warning/Destructive**: Orange and red for alerts
- **Gradients**: Smooth gradients for visual appeal
- **Shadows**: Glow effects for interactive elements

## Key Workflows

### 1. Swap Tokens

1. Select input and output tokens
2. Enter amount to swap
3. View real-time quote with price impact
4. Adjust slippage settings if needed
5. Connect wallet (mock)
6. Execute swap

### 2. Add Liquidity

1. Select token pair
2. Choose fee tier (0.05%, 0.3%, 1%)
3. Enter amount for first token
4. System calculates optimal amount for second token
5. Review pool share percentage
6. Add liquidity and receive NFT position

### 3. Manage Positions

1. View all NFT positions in portfolio
2. Track real-time position value
3. Monitor accumulated fees
4. Claim fees when desired
5. Remove liquidity partially or fully

### 4. Browse Pools

1. View all available pools
2. Sort by TVL, APR, or volume
3. Search for specific token pairs
4. View detailed pool statistics
5. Quick access to add liquidity or swap

## Mathematical Formulas

### Constant Product AMM

**Invariant**: `x * y = k`

**Swap Output**:
```
output = (input * (1 - fee) * reserve_out) / (reserve_in + input * (1 - fee))
```

**LP Token Minting** (Initial):
```
lp_tokens = sqrt(amount_a * amount_b)
```

**LP Token Minting** (Subsequent):
```
lp_tokens = (amount_a * total_supply) / reserve_a
```

**Price Impact**:
```
price_impact = |((reserve_out / reserve_in) - (output / input)) / (reserve_out / reserve_in)| * 100
```

**Impermanent Loss**:
```
IL = (2 * sqrt(price_ratio)) / (1 + price_ratio) - 1
```

### StableSwap

Uses an amplification coefficient to reduce slippage for stable pairs:
```
A * n^n * sum(x_i) + D = A * D * n^n + D^(n+1) / (n^n * prod(x_i))
```

## Fee Structure

- **Low Fee Tier**: 0.05% - Best for stablecoin pairs
- **Medium Fee Tier**: 0.30% - Most token pairs
- **High Fee Tier**: 1.00% - Exotic or volatile pairs

Fees are distributed proportionally to liquidity providers based on their pool share.

## NFT Position Metadata

Each LP position NFT contains:
- Pool information (token pair, fee tier)
- LP token amount
- Pool share percentage
- Current position value in USD
- Token amounts (A and B)
- Accumulated fees (A and B)
- Impermanent loss percentage
- Creation and last update timestamps

## Slippage Protection

- **Auto Slippage**: Automatically calculates optimal slippage based on pool depth
- **Manual Slippage**: Set custom tolerance (0.1% - 50%)
- **Deadline**: Transaction reverts if not executed within specified time
- **Minimum Received**: Enforces minimum output amount based on slippage tolerance

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: Biome

## Project Structure

```
src/
├── components/
│   ├── amm/              # AMM-specific components
│   ├── common/           # Shared components (Header, Footer)
│   └── ui/               # shadcn/ui components
├── contexts/
│   └── AMMContext.tsx    # Global state management
├── pages/
│   ├── HomePage.tsx      # Landing page
│   ├── SwapPage.tsx      # Token swap interface
│   ├── PoolsPage.tsx     # Pool browser
│   ├── LiquidityPage.tsx # Add/remove liquidity
│   └── PositionsPage.tsx # LP position management
├── services/
│   ├── ammMath.ts        # AMM mathematical formulas
│   ├── poolService.ts    # Pool operations
│   ├── swapService.ts    # Swap operations
│   ├── liquidityService.ts # Liquidity operations
│   └── mockData.ts       # Sample data
├── types/
│   └── index.ts          # TypeScript type definitions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── index.css             # Design system and global styles
```

## Development Notes

### Mock Implementation

This is a **frontend demonstration** of AMM functionality. Key points:

- All calculations are performed client-side
- Wallet connection is mocked for demonstration
- No actual blockchain transactions occur
- Pool data and positions are stored in memory
- Transaction signing is simulated

### Blockchain Integration

For actual blockchain deployment on SUI:

1. Implement smart contracts in Move language:
   - PoolFactory module
   - LiquidityPool module
   - LPPositionNFT module
   - StableSwapPool module
   - FeeDistributor module

2. Replace mock services with blockchain interactions:
   - Use SUI SDK for transaction building
   - Implement wallet adapter (e.g., Sui Wallet)
   - Add transaction signing and submission
   - Listen to on-chain events

3. Add backend services:
   - Indexer for historical data
   - Price feeds for USD values
   - Analytics aggregation

## Testing

The application includes comprehensive validation:

- **Mathematical Correctness**: All AMM formulas verified
- **Slippage Protection**: Minimum output enforcement
- **Fee Calculations**: Accurate fee distribution
- **Position Tracking**: Real-time value updates
- **User Workflows**: End-to-end flow testing
- **Code Quality**: Passes all linting checks

## Future Enhancements

Potential additions for production deployment:

1. **Multi-hop Routing**: Find best rates across multiple pools
2. **Limit Orders**: Place orders at specific prices
3. **Concentrated Liquidity**: Uniswap v3-style range orders
4. **Governance**: DAO for protocol parameters
5. **Farming**: Additional rewards for LPs
6. **Analytics Dashboard**: Advanced charts and metrics
7. **Mobile App**: Native mobile experience
8. **Cross-chain**: Bridge to other blockchains

## Security Considerations

For production deployment:

- Audit all smart contracts
- Implement access controls
- Add emergency pause functionality
- Set up monitoring and alerts
- Implement rate limiting
- Add circuit breakers for extreme volatility
- Secure private key management
- Implement multi-sig for admin functions

## License

This project is a demonstration application for educational purposes.

## Contact

For questions or feedback about this implementation, please refer to the project documentation.
