// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


interface IAssetManager {
    function tokenizeItem(address _creator) external returns (uint256);
}
