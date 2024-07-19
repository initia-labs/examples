// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "evm-contracts/erc20_factory/ERC20Factory.sol";

/**
 * @title TokenLauncher
 * @dev Contract for creating new ERC20 tokens using an ERC20Factory
 * @notice This contract allows users to launch new ERC20 tokens with specified parameters
 */
contract TokenLauncher {
    /// @dev The ERC20Factory used to create new tokens
    ERC20Factory public immutable factory;
    
    /// @dev The address of the most recently created token
    address public token;

    /**
     * @dev Constructs the TokenLauncher with a specified ERC20Factory
     * @param _factory The address of the ERC20Factory contract
     */
    constructor(address _factory) {
        factory = ERC20Factory(_factory);
    }

    /**
     * @dev Launches a new ERC20 token using the factory
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals The number of decimal places for token precision
     * @notice This function creates a new ERC20 token and stores its address
     */
    function launchToken(string memory name, string memory symbol, uint8 decimals) public {
        token = factory.createERC20(name, symbol, decimals);
    }
}