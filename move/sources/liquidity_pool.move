module mint_lp::liquidity_pool {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::string::String;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::option;

    /// Errors
    const E_POOL_EXISTS: u64 = 1;
    const E_POOL_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 3;
    const E_INSUFFICIENT_INPUT_AMOUNT: u64 = 4;
    const E_INSUFFICIENT_OUTPUT_AMOUNT: u64 = 5;
    const E_INVALID_RESERVES: u64 = 6;
    const E_NOT_CREATOR: u64 = 7;
    const E_OVERLIMIT: u64 = 8;
    const E_MINIMUM_LIQUIDITY: u64 = 9;
    const E_NOT_OWNER: u64 = 10;

    /// The liquidity pool resource
    struct LiquidityPool<phantom CoinX, phantom CoinY> has key {
        coin_x_reserve: Coin<CoinX>,
        coin_y_reserve: Coin<CoinY>,
        k_last: u128,
        total_liquidity: u128, // Track total global liquidity since we don't have a coin supply
    }

    /// LP Position Object - This is the "NFT"
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct LPPosition has key {
        pool_address: address, // The address where LiquidityPool is stored (usually @mint_lp)
        liquidity: u64,
        pool_type_x: String, // Metadata for UI
        pool_type_y: String,
    }

    /// Events (simplified)
    #[event]
    struct PoolCreatedEvent has drop, store {
        pool: address,
        creator: address,
    }

    #[event]
    struct AddLiquidityEvent has drop, store {
        user: address,
        amount_x: u64,
        amount_y: u64,
        lp_minted: u64,
        lp_object_addr: address,
    }

    #[event]
    struct SwapEvent has drop, store {
        user: address,
        amount_in: u64,
        amount_out: u64,
        x_to_y: bool,
    }

    /// Initialize a new liquidity pool
    public entry fun initialize_pool<CoinX, CoinY>(
        account: &signer,
        _lp_name: String, // Kept for API compatibility but unused
        _lp_symbol: String,
        _initial_x: u64,
        _initial_y: u64 
    ) {
        let account_addr = signer::address_of(account);
        assert!(!exists<LiquidityPool<CoinX, CoinY>>(account_addr), E_POOL_EXISTS);

        move_to(account, LiquidityPool<CoinX, CoinY> {
            coin_x_reserve: coin::zero<CoinX>(),
            coin_y_reserve: coin::zero<CoinY>(),
            k_last: 0,
            total_liquidity: 0,
        });
    }

    /// Add liquidity - RETURNS A UNIQUE NFT LP POSITION
    public entry fun add_liquidity<CoinX, CoinY>(
        account: &signer,
        amount_x_desired: u64,
        amount_y_desired: u64,
        amount_x_min: u64,
        amount_y_min: u64,
    ) acquires LiquidityPool {
        let pool_addr = @mint_lp;
        assert!(exists<LiquidityPool<CoinX, CoinY>>(pool_addr), E_POOL_NOT_FOUND);
        
        let pool = borrow_global_mut<LiquidityPool<CoinX, CoinY>>(pool_addr);
        
        // 1. Calculate actual amounts
        let reserve_x = coin::value(&pool.coin_x_reserve);
        let reserve_y = coin::value(&pool.coin_y_reserve);

        let amount_x = amount_x_desired;
        let amount_y = amount_y_desired;

        if (reserve_x > 0 && reserve_y > 0) {
            let amount_y_optimal = quote(amount_x_desired, reserve_x, reserve_y);
            if (amount_y_optimal <= amount_y_desired) {
                assert!(amount_y_optimal >= amount_y_min, E_insufficient_amount());
                amount_y = amount_y_optimal;
            } else {
                let amount_x_optimal = quote(amount_y_desired, reserve_y, reserve_x);
                assert!(amount_x_optimal <= amount_x_desired, E_OVERLIMIT); 
                assert!(amount_x_optimal >= amount_x_min, E_insufficient_amount());
                amount_x = amount_x_optimal;
            }
        };

        // 2. Transfer coins in
        let coins_x = coin::withdraw<CoinX>(account, amount_x);
        let coins_y = coin::withdraw<CoinY>(account, amount_y);
        
        // 3. Deposit to reserves
        coin::merge(&mut pool.coin_x_reserve, coins_x);
        coin::merge(&mut pool.coin_y_reserve, coins_y);

        // 4. Calculate Liquidity Amount
        let liquidity: u64; 
        if (pool.total_liquidity == 0) {
            liquidity = std::math64::sqrt(amount_x * amount_y);
        } else {
            let liquidity_x = (amount_x * (pool.total_liquidity as u64)) / reserve_x;
            let liquidity_y = (amount_y * (pool.total_liquidity as u64)) / reserve_y;
            liquidity = if (liquidity_x < liquidity_y) liquidity_x else liquidity_y;
        };

        assert!(liquidity > 0, E_INSUFFICIENT_LIQUIDITY);

        // 5. Update Total Liquidity
        pool.total_liquidity = pool.total_liquidity + (liquidity as u128);

        // 6. MINT LP NFT POSITION
        // We create an object that is owned by the user.
        let constructor_ref = object::create_object(signer::address_of(account));
        let object_signer = object::generate_signer(&constructor_ref);
        
        // Store the LPPosition struct resource on the object
        move_to(&object_signer, LPPosition {
            pool_address: pool_addr,
            liquidity: liquidity,
            pool_type_x: aptos_framework::type_info::type_name<CoinX>(), // Debug helper
            pool_type_y: aptos_framework::type_info::type_name<CoinY>(),
        });

        // Implicitly transferred to 'account' because `create_object` makes it owned by creator by default
        // No need to manually transfer unless we used `create_sticky_object` or similar specifics.
    }

    /// Remove liquidity by burning the LP Position NFT
    public entry fun remove_liquidity<CoinX, CoinY>(
        account: &signer,
        lp_position_obj: Object<LPPosition>,
        amount_min_x: u64,
        amount_min_y: u64
    ) acquires LiquidityPool, LPPosition {
        let pool_addr = @mint_lp;
        let pool = borrow_global_mut<LiquidityPool<CoinX, CoinY>>(pool_addr);
        
        // 1. Verify ownership and get liquidity amount
        assert!(object::is_owner(lp_position_obj, signer::address_of(account)), E_NOT_OWNER);
        
        let lp_position_addr = object::object_address(&lp_position_obj);
        let LPPosition { pool_address: _, liquidity, pool_type_x: _, pool_type_y: _ } = move_from<LPPosition>(lp_position_addr);
        
        // 2. Burn the object (delete it)
        object::delete(option::destroy_some(object::unbind<LPPosition>(lp_position_obj)));

        // 3. Calculate return amounts
        let reserve_x = coin::value(&pool.coin_x_reserve);
        let reserve_y = coin::value(&pool.coin_y_reserve);
        let total_supply = pool.total_liquidity as u64;

        let amount_x = (liquidity as u128 * (reserve_x as u128) / (total_supply as u128)) as u64;
        let amount_y = (liquidity as u128 * (reserve_y as u128) / (total_supply as u128)) as u64;

        assert!(amount_x >= amount_min_x && amount_y >= amount_min_y, E_INSUFFICIENT_OUTPUT_AMOUNT);

        // 4. Update total supply
        pool.total_liquidity = pool.total_liquidity - (liquidity as u128);

        // 5. Return tokens
        let coins_x = coin::extract(&mut pool.coin_x_reserve, amount_x);
        let coins_y = coin::extract(&mut pool.coin_y_reserve, amount_y);

        coin::deposit(signer::address_of(account), coins_x);
        coin::deposit(signer::address_of(account), coins_y);
    }

    /// Swap
    public entry fun swap<CoinX, CoinY>(
        account: &signer,
        amount_in: u64,
        min_amount_out: u64,
        is_x_to_y: bool,
    ) acquires LiquidityPool {
        let pool_addr = @mint_lp;
        let pool = borrow_global_mut<LiquidityPool<CoinX, CoinY>>(pool_addr);

        let reserve_in = if (is_x_to_y) coin::value(&pool.coin_x_reserve) else coin::value(&pool.coin_y_reserve);
        let reserve_out = if (is_x_to_y) coin::value(&pool.coin_y_reserve) else coin::value(&pool.coin_x_reserve);

        let amount_out = get_amount_out(amount_in, reserve_in, reserve_out);
        assert!(amount_out >= min_amount_out, E_INSUFFICIENT_OUTPUT_AMOUNT);

        if (is_x_to_y) {
            let coins_in = coin::withdraw<CoinX>(account, amount_in);
            coin::merge(&mut pool.coin_x_reserve, coins_in);
            
            let coins_out = coin::extract(&mut pool.coin_y_reserve, amount_out);
            coin::deposit(signer::address_of(account), coins_out);
        } else {
            let coins_in = coin::withdraw<CoinY>(account, amount_in);
            coin::merge(&mut pool.coin_y_reserve, coins_in);
            
            let coins_out = coin::extract(&mut pool.coin_x_reserve, amount_out);
            coin::deposit(signer::address_of(account), coins_out);
        }
    }

    // Maths
    fun quote(amount_a: u64, reserve_a: u64, reserve_b: u64): u64 {
        assert!(amount_a > 0, E_INSUFFICIENT_INPUT_AMOUNT);
        assert!(reserve_a > 0 && reserve_b > 0, E_INSUFFICIENT_LIQUIDITY);
        ((amount_a as u128) * (reserve_b as u128) / (reserve_a as u128)) as u64
    }

    fun get_amount_out(amount_in: u64, reserve_in: u64, reserve_out: u64): u64 {
        assert!(amount_in > 0, E_INSUFFICIENT_INPUT_AMOUNT);
        assert!(reserve_in > 0 && reserve_out > 0, E_INSUFFICIENT_LIQUIDITY);
        
        let amount_in_with_fee = (amount_in as u128) * 997; // 0.3% fee
        let numerator = amount_in_with_fee * (reserve_out as u128);
        let denominator = (reserve_in as u128) * 1000 + amount_in_with_fee;
        
        (numerator / denominator) as u64
    }
    
    fun E_insufficient_amount(): u64 { 4 } // helper

    #[view]
    public fun get_reserves<CoinX, CoinY>(): (u64, u64) acquires LiquidityPool {
        let pool_addr = @mint_lp;
        if (!exists<LiquidityPool<CoinX, CoinY>>(pool_addr)) {
            return (0, 0)
        };
        let pool = borrow_global<LiquidityPool<CoinX, CoinY>>(pool_addr);
        (coin::value(&pool.coin_x_reserve), coin::value(&pool.coin_y_reserve))
    }
}
