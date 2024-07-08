module example::oracle_example {
    use std::string::String;
    use initia_std::oracle::get_price;

    #[view]
    public fun get_price_example(pair_id: String): (u256, u64, u64) {
        let (price, timestamp, decimals) = get_price(pair_id);
        (price, timestamp, decimals)
    }

    #[test]
    public fun test_get_price_example(): (u256, u64, u64) {
        let btc_usd_pair_id = string::utf8(b"BITCOIN/USD"); 
        let (price, timestamp, decimals) = get_price_example(btc_usd_pair_id);
        (price, timestamp, decimals)
    }
}