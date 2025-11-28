# Decentralized AMM with NFT-based LP Positions Requirements Document

## 1. Project Overview

### 1.1 Problem Statement
Build a capital-efficient Automated Market Maker (AMM) on SUI blockchain that supports:
- NFT-based liquidity provider (LP) positions
- Constant-product formula (x * y = k)
- Transparent fee accrual mechanism
- Accurate slippage protection
- Clear ownership representation via NFTs

### 1.2 Project Objectives
- Implement an AMM using the constant-product formula
- Create NFT-based LP positions with full metadata
- Provide transparent, automated fee distribution\n- Enable efficient swap execution with slippage protection
- Implement StableSwap variant for stable-asset pools

## 2. Technical Architecture

### 2.1 Smart Contract Modules

#### 2.1.1 PoolFactory Contract
- Creates and manages liquidity pools
- Supports configurable parameters
- Maintains pool registry and indexing
- Gathers protocol-level fees
- Supports fee tiers: 0.05%, 0.3%, 1%

#### 2.1.2 LiquidityPool Contract
Core AMM logic implementation:
- Constant-product formula: x * y = k
- Swap execution with fee collection\n- Liquidity addition and removal
- Reserve tracking and updates\n
#### 2.1.3 LPPosition NFT Contract
NFT representing LP positions:
- Mint when liquidity is added
- Track LP share amounts
- Display real-time position value
- Track accumulated fees
- Transferable ownership
- Burn on liquidity removal

#### 2.1.4 StableSwapPool Contract
Optimized for similar-priced assets:
- Amplification coefficient
- Lower slippage curve
- Efficient stable-to-stable swaps
- Uses same NFT system

#### 2.1.5 FeeDistributor Contract
Fee management logic:
- Collects swap fees per pool
- Calculates pro-rata shares
- Allows LPs to claim fees
- Supports protocol fee distribution
- Optional auto-compounding

#### 2.1.6 SlippageProtection Contract
Slippage management:\n- Real-time slippage calculation
- Deadline enforcement\n- Price limit order support

## 3. Functional Requirements

### 3.1 User Roles and Features

#### 3.1.1 Trader Features
- Swap tokens with predictable slippage
- View real-time exchange rates
- See price impact before swap
- Execute swaps at best rates
- Set slippage tolerance
- View swap history and statistics

#### 3.1.2 Liquidity Provider Features
- Add liquidity to earn swap fees
- Receive NFT representing position
- View real-time position value
- Track accumulated fees
- Monitor impermanent loss
- Remove liquidity fully or partially
- Transfer LP NFT to others

#### 3.1.3 LP Position Holder Features
- View NFT metadata on-chain
- Inspect dynamic metadata updates
- Claim accumulated fees
- Auto-compound fees
- Display NFTs in wallets and marketplaces

#### 3.1.4 Pool Creator Features
- Create new token pairs
- Provide initial liquidity
- Earn pool creation fees (optional)

### 3.2 Core Workflows

#### 3.2.1 Pool Creation Workflow
1. User calls create_pool with token pair and fee tier
2. Validate token pair uniqueness for the fee tier
3. User provides initial liquidity
4. Pool computes initial K = reserve_a * reserve_b
5. Mint LP tokens using geometric mean: sqrt(a * b)
6. Create NFT position for the pool creator
7. Emit PoolCreated event
8. Register pool in factory index

#### 3.2.2 Add Liquidity Workflow
1. LP selects pool and deposit amounts
2. System calculates ratio: amount_b = (amount_a * reserve_b) / reserve_a
3. LP supplies both tokens
4. Validate ratio within ±0.5%
5. Compute minted LP tokens: lp_tokens = (amount_a * total_supply) / reserve_a\n6. Mint LP tokens and update NFT position
7. Update pool reserves
8. Emit LiquidityAdded event

#### 3.2.3 Swap Execution Workflow
1. User sets input token, amount, and minimum output
2. Compute expected output via AMM formula
3. Apply fee (e.g., 0.3%)
4. Enforce slippage check\n5. Transfer input tokens to pool
6. Calculate output: (input_with_fee * reserve_out) / (reserve_in + input_with_fee)
7. Transfer output tokens to user
8. Update reserves keeping K constant
9. Add fee to LP fee pool
10. Emit SwapExecuted event

#### 3.2.4 Fee Claiming Workflow
1. LP checks accumulated fees via NFT position
2. Calls claim_fees function
3. System computes LP share = lp_tokens / total_supply
4. Calculate claimable fees = accumulated_fees * LP_share
5. Transfer fees to LP
6. Update NFT metadata
7. Emit FeeClaimed event\n
#### 3.2.5 Remove Liquidity Workflow
1. LP specifies LP tokens to burn
2. System calculates:\n   - amount_a = (lp_tokens * reserve_a) / total_supply
   - amount_b = (lp_tokens * reserve_b) / total_supply
3. Validate minimum slippage
4. Transfer tokens to LP
5. If fully removed, burn NFT
6. Update reserves
7. Emit LiquidityRemoved event

## 4. Testing Requirements

### 4.1 Unit Tests
\n#### AMM Math Testing
- x * y = k verification
- Output amount formula
- Price impact calculation
- Fee calculation accuracy
- Extreme values handling

#### LP NFT Testing
- Minting logic
- Metadata updates
- Value computation
- Fee accrual tracking
- Impermanent loss calculation

#### Slippage Protection Testing
- Minimum output enforcement
- Deadline logic
- Price impact limits

### 4.2 Integration Tests
\n#### End-to-End Flows
- Complete flow: Create pool → Add liquidity → Swap → Claim fees → Remove liquidity
- Multiple LPs scenarios
- Concurrent swaps handling
\n#### Capital Efficiency Checks
- K constant stability verification
- Fee accumulation accuracy\n- LP value tracking
- Impermanent loss scenarios

### 4.3 Test Coverage
- Minimum 80% code coverage
- AMM math verification
- Integration scenarios
- Gas usage benchmarking
- Simulation tests\n- Security checklist validation

## 5. Deliverables

### 5.1 Smart Contracts
- PoolFactory contract
- LiquidityPool contract
- StableSwapPool contract
- LPPositionNFT contract
- FeeDistributor contract
- SlippageProtection contract\n
### 5.2 Testing Suite
- Full test suite with >80% coverage
- AMM math verification tests
- Integration scenario tests
- Gas usage benchmarks
- Simulation tests
- Security checklist\n
### 5.3 Demo Components
- Sample pools with tokens\n- Swap interface (CLI or Web)
- LP position viewer\n- NFT metadata display
- Video walkthrough script
- Testnet deployment guide
\n## 6. Evaluation Criteria

### 6.1 Mathematical Correctness (25%)
- Accurate implementation of constant-product formula
- Correct fee calculations
- Precise slippage computations
\n### 6.2 LP NFT Innovation (25%)
- NFT metadata completeness
- Real-time value tracking
- Dynamic metadata updates
\n### 6.3 Slippage Management (20%)\n- Effective slippage protection
- Deadline enforcement
- Price impact accuracy

### 6.4 Capital Efficiency (15%)
- K constant maintenance
- Fee distribution efficiency
- Optimal liquidity utilization

### 6.5 Code Quality (15%)
- Clean code structure
- Comprehensive documentation
- Test coverage
- Security best practices