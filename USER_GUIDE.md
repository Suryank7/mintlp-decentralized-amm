# User Guide: Decentralized AMM with NFT-based LP Positions

## Welcome to the AMM Protocol

This guide will help you navigate and use all features of the Decentralized Automated Market Maker (AMM) application.

## Getting Started

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button in the top-right corner
2. Your wallet will be connected (this is a demo, so it's instant)
3. Once connected, you'll see a **"Disconnect"** button and have access to all features

## Features Overview

### 🔄 Swap Tokens

Trade one token for another with transparent pricing and slippage protection.

**How to Swap:**

1. Navigate to the **Swap** page
2. Select the token you want to pay (input token)
3. Enter the amount you want to swap
4. Select the token you want to receive (output token)
5. Review the swap details:
   - Exchange rate
   - Price impact
   - Minimum received amount
   - Trading fee
6. Adjust slippage settings if needed (click the ⚙️ icon)
7. Click **"Swap"** to execute the trade

**Understanding Swap Details:**

- **Rate**: Current exchange rate between the two tokens
- **Price Impact**: How much your trade affects the pool price
  - 🟢 Green (< 1%): Low impact, good trade
  - 🟡 Yellow (1-3%): Moderate impact
  - 🟠 Orange (3-5%): High impact, consider reducing amount
  - 🔴 Red (> 5%): Critical impact, strongly consider reducing amount
- **Minimum Received**: The minimum amount you'll receive based on your slippage tolerance
- **Fee**: Trading fee paid to liquidity providers

**Slippage Settings:**

- **Auto**: Automatically calculates optimal slippage
- **Preset**: Choose 0.1%, 0.5%, or 1%
- **Custom**: Set your own tolerance (up to 50%)
- **Deadline**: Transaction expires after this many minutes

### 💧 Provide Liquidity

Add liquidity to pools and earn trading fees through NFT-based positions.

**How to Add Liquidity:**

1. Navigate to the **Liquidity** page
2. Select **"Add Liquidity"** tab
3. Choose a fee tier:
   - **0.05%**: Best for stablecoin pairs (USDC/USDT)
   - **0.30%**: Most token pairs (default)
   - **1.00%**: Exotic or volatile pairs
4. Select the first token (Token A)
5. Enter the amount for Token A
6. Select the second token (Token B)
7. The system automatically calculates the optimal amount for Token B
8. Review position details:
   - Pool share percentage
   - Exchange rate
9. Click **"Add Liquidity"**
10. You'll receive an NFT representing your position!

**Creating a New Pool:**

If a pool doesn't exist for your token pair:
- The system will notify you
- You'll create the pool with your initial liquidity
- You become the first liquidity provider
- You set the initial price ratio

**Understanding Pool Share:**

Your pool share determines:
- Your portion of the pool's liquidity
- Your share of trading fees
- Your voting weight (in governance)

### 🏊 Browse Pools

Explore all available liquidity pools and their statistics.

**Pool Information:**

Each pool displays:
- **Token Pair**: The two tokens in the pool
- **Fee Tier**: Trading fee percentage
- **Pool Type**: Standard or Stable
- **TVL**: Total Value Locked in the pool
- **24h Volume**: Trading volume in the last 24 hours
- **APR**: Annual Percentage Rate (estimated returns)

**Sorting Options:**

- **TVL**: Highest total value locked
- **APR**: Highest returns
- **Volume**: Most traded pools

**Search:**

Use the search bar to find specific token pairs quickly.

### 🎨 Manage Positions

View and manage your NFT-based liquidity positions.

**Position Overview:**

Your portfolio shows:
- **Total Value**: Combined value of all positions
- **Total Fees Earned**: Cumulative fees from all positions
- **Impermanent Loss**: Overall IL across positions

**Individual Position Details:**

Each NFT position card shows:
- **NFT ID**: Unique identifier (last 6 characters)
- **Token Pair**: Tokens in the pool
- **Position Value**: Current USD value
- **Pool Share**: Your percentage of the pool
- **Liquidity**: Amounts of each token
- **Accumulated Fees**: Fees earned but not yet claimed
- **Impermanent Loss**: IL percentage (if any)

**Managing Positions:**

- **Claim Fees**: Collect your earned trading fees
- **Manage**: View detailed position information
- **Remove Liquidity**: Withdraw your liquidity (coming soon)

### 📊 Understanding Key Concepts

#### Impermanent Loss (IL)

Impermanent Loss occurs when the price ratio of your deposited tokens changes compared to when you deposited them.

**Example:**
- You deposit 1 ETH + 2000 USDC (1 ETH = 2000 USDC)
- ETH price doubles to 4000 USDC
- If you had just held, you'd have: 1 ETH + 2000 USDC = $6000
- In the pool, you have: 0.707 ETH + 2828 USDC = $5656
- Impermanent Loss: -5.7%

**Important Notes:**
- IL is "impermanent" because it only becomes permanent when you withdraw
- Trading fees can offset or exceed IL
- IL is lower in stable pairs (USDC/USDT)
- IL is higher in volatile pairs

#### Annual Percentage Rate (APR)

APR shows estimated yearly returns from trading fees.

**Calculation:**
```
APR = (24h Fees / TVL) × 365 × 100
```

**Factors Affecting APR:**
- Trading volume (more trades = more fees)
- Pool size (smaller pools = higher APR per trade)
- Fee tier (higher fees = higher APR)
- Market volatility (more volatility = more trades)

#### Total Value Locked (TVL)

TVL is the total value of all assets in a pool.

**Why TVL Matters:**
- Higher TVL = lower slippage for traders
- Higher TVL = more stable prices
- Higher TVL = lower APR (fees spread across more liquidity)
- Lower TVL = higher APR but higher risk

#### Price Impact

Price impact shows how much your trade moves the market price.

**Minimizing Price Impact:**
- Trade smaller amounts
- Split large trades into multiple transactions
- Use pools with higher liquidity
- Wait for better market conditions

## Tips for Success

### For Traders

1. **Check Price Impact**: Always review before swapping
2. **Use Appropriate Slippage**: Too low = failed trades, too high = worse prices
3. **Compare Pools**: Different fee tiers may offer better rates
4. **Time Your Trades**: Avoid trading during high volatility
5. **Start Small**: Test with small amounts first

### For Liquidity Providers

1. **Choose Stable Pairs**: Lower IL risk (USDC/USDT)
2. **Monitor Positions**: Check IL and fees regularly
3. **Claim Fees**: Collect fees periodically or let them compound
4. **Diversify**: Spread liquidity across multiple pools
5. **Understand Risks**: IL can exceed fee earnings in volatile markets

### For Pool Creators

1. **Set Fair Prices**: Initial ratio determines starting price
2. **Provide Sufficient Liquidity**: Attract traders with deep liquidity
3. **Choose Appropriate Fee Tier**: Match volatility and competition
4. **Monitor Performance**: Track volume and adjust strategy

## Common Questions

### Why did my swap fail?

Possible reasons:
- Price moved beyond your slippage tolerance
- Transaction deadline expired
- Insufficient balance
- Pool liquidity too low

**Solution**: Increase slippage tolerance or try again

### Why is my position value different from what I deposited?

This is due to:
- Price changes (impermanent loss)
- Accumulated fees (increases value)
- Market volatility

**Note**: Your position value updates in real-time

### When should I claim fees?

Consider:
- **Claim regularly**: Lock in profits, reduce risk
- **Let compound**: Fees stay in pool, earn more fees
- **Gas costs**: In production, consider transaction fees

### How do I reduce impermanent loss?

Strategies:
- Provide liquidity to stable pairs
- Choose pools with high trading volume (fees offset IL)
- Hold positions long-term (fees accumulate)
- Monitor and exit if IL becomes too high

### What happens to my NFT if I remove all liquidity?

- The NFT is burned (destroyed)
- You receive your tokens back
- Accumulated fees are automatically claimed
- Position is removed from your portfolio

## Safety Tips

1. **Verify Token Addresses**: Ensure you're trading the correct tokens
2. **Start Small**: Test with small amounts first
3. **Understand Risks**: IL, smart contract risk, market risk
4. **Keep Records**: Track your positions and transactions
5. **Stay Informed**: Monitor market conditions

## Need Help?

- Review this guide for detailed instructions
- Check the project documentation for technical details
- Experiment with small amounts to learn
- Monitor your positions regularly

## Glossary

- **AMM**: Automated Market Maker - algorithmic trading protocol
- **LP**: Liquidity Provider - user who deposits tokens
- **TVL**: Total Value Locked - total assets in a pool
- **APR**: Annual Percentage Rate - estimated yearly returns
- **IL**: Impermanent Loss - temporary loss from price changes
- **Slippage**: Difference between expected and actual price
- **Fee Tier**: Percentage charged on each trade
- **Pool Share**: Your percentage of total pool liquidity
- **NFT Position**: Non-fungible token representing your LP position

---

**Happy Trading and Providing Liquidity! 🚀**
