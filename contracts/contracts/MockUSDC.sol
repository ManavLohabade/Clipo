// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing on Avalanche testnet
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6; // USDC has 6 decimals

    constructor(address initialOwner) ERC20("USD Coin", "USDC") Ownable(initialOwner) {}

    /**
     * @dev Mint tokens for testing
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Override decimals to return 6
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Burn tokens
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
