// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "evm-contracts/initia_erc20/InitiaERC20.sol";

/**
 * @title NewInitiaERC20
 * @dev Demo extension of InitiaERC20 token contract with initial minting functionality
 */
contract NewInitiaERC20 is InitiaERC20 {
    /**
     * @dev Constructor for creating a new InitiaERC20 token with initial minted supply
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param decimals_ The number of decimal places for token precision
     * @param mintedTokens_ The initial amount of tokens to mint to the contract deployer
     */
    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 mintedTokens_) InitiaERC20(name_, symbol_, decimals_) {
        _mint(msg.sender, mintedTokens_);
    }
}
