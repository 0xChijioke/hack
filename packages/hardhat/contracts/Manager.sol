//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";


contract Manager is AccessManager {

    // Role definitions
    bytes32 public constant VENDOR_ROLE = keccak256("VENDOR_ROLE");
    bytes32 public constant CUSTOMER_ROLE = keccak256("CUSTOMER_ROLE");


    // bytes4 private constant ADD_PRODUCT_SELECTOR = bytes4(keccak256("addProduct(string,uint256)"));
    // bytes4 private constant PURCHASE_PRODUCT_SELECTOR = bytes4(keccak256("purchaseProduct(uint256)"));


    constructor(address initialAdmin) AccessManager(initialAdmin) {}









     // ============================================= FUNCTION MANAGEMENT ==============================================







    // Function to interact with roles
    function grantRole(bytes32 roleId, address account) external onlyAuthorized() {
        _grantRole(roleId, account);
    }


    function revokeRole(bytes32 roleId, address account) external onlyAuthorized() {
        _revokeRole(roleId, account);
    }

    function renounceRole(bytes32 roleId, address account) external {
        _renounceRole(roleId, account);
    }

    // Set the role required to call certain functions
    function setTargetFunctionRole(address target, bytes4[] calldata selectors, bytes32 roleId) external onlyAuthorized() {
        for (uint256 i = 0; i < selectors.length; i++) {
            _setRoleSelector(roleId, target, selectors[i]);
        }
    }



    // Function to set the closed flag for a contract
    function setTargetClosed(address target, bool closed) external {
        // Implement 
    }
}