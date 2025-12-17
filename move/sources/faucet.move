module mint_lp::faucet {
    use std::signer;
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::string::{Self, String};

    /// Errors
    const E_ALREADY_INITIALIZED: u64 = 1;

    struct FaucetCoinA {}
    struct FaucetCoinB {}

    struct FaucetCapabilities has key {
        mint_cap_a: MintCapability<FaucetCoinA>,
        burn_cap_a: BurnCapability<FaucetCoinA>,
        mint_cap_b: MintCapability<FaucetCoinB>,
        burn_cap_b: BurnCapability<FaucetCoinB>,
    }

    public entry fun initialize_faucet(admin: &signer) {
        let (burn_a, freeze_a, mint_a) = coin::initialize<FaucetCoinA>(
            admin,
            string::utf8(b"Mock Token A"),
            string::utf8(b"MKA"),
            8,
            true,
        );
        let (burn_b, freeze_b, mint_b) = coin::initialize<FaucetCoinB>(
            admin,
            string::utf8(b"Mock Token B"),
            string::utf8(b"MKB"),
            8,
            true,
        );

        coin::destroy_freeze_cap(freeze_a);
        coin::destroy_freeze_cap(freeze_b);

        move_to(admin, FaucetCapabilities {
            mint_cap_a: mint_a,
            burn_cap_a: burn_a,
            mint_cap_b: mint_b,
            burn_cap_b: burn_b,
        });
    }

    public entry fun mint_test_tokens(user: &signer, amount: u64) acquires FaucetCapabilities {
        let admin_addr = @mint_lp;
        let caps = borrow_global<FaucetCapabilities>(admin_addr);
        
        // Mint Coin A
        let coins_a = coin::mint(amount, &caps.mint_cap_a);
        if (!coin::is_account_registered<FaucetCoinA>(signer::address_of(user))) {
            coin::register<FaucetCoinA>(user);
        };
        coin::deposit(signer::address_of(user), coins_a);

        // Mint Coin B
        let coins_b = coin::mint(amount, &caps.mint_cap_b);
        if (!coin::is_account_registered<FaucetCoinB>(signer::address_of(user))) {
            coin::register<FaucetCoinB>(user);
        };
        coin::deposit(signer::address_of(user), coins_b);
    }
}
