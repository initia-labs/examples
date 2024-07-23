pragma solidity ^0.8.24;

// lib/initia-evm-contracts/src/interfaces/ISlinky.sol

interface ISlinky {
    struct Price {
        uint256 price;
        uint256 timestamp;
        uint64 height;
        uint64 nonce;
        uint64 decimal;
        uint64 id;
    }

    function get_all_currency_pairs() external returns (string memory);
    function get_price(string memory base, string memory quote) external returns (Price memory);
    function get_prices(string[] memory pair_ids) external returns (Price[] memory);
}

// src/Oracle.sol

contract Oracle {

    ISlinky immutable public slinky;

    string public currencyPairs;
    ISlinky.Price public price;
    ISlinky.Price[] public prices;

    constructor (address _slinky) {
        slinky = ISlinky(_slinky);
    }

    function oracle_get_all_currency_pairs() external {
        currencyPairs = slinky.get_all_currency_pairs();
    }

    function oracle_get_price() external {
        string memory base = "BTC";
        string memory quote = "USD";
        price = slinky.get_price(base, quote);
    }

    function oracle_get_prices() external {
        string[] memory pair_ids = new string[](2);
        pair_ids[0]= "BTC/USD";
        pair_ids[1]= "ETH/USD";
        
        ISlinky.Price[] memory memoryPrices = slinky.get_prices(pair_ids);

        // Clear the existing storage array
        delete prices;

        // Copy each element from memory to storage
        for (uint256 i = 0; i < memoryPrices.length; i++) {
            prices.push(memoryPrices[i]);
        }
    }
}
