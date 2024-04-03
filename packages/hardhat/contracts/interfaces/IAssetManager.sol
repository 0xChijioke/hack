// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


interface IAssetManager {
    function tokenizeItem(string calldata name, uint256 price) external returns (uint256);
}
