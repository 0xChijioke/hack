//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/manager/AccessManager.sol";


contract Manager is AccessManager {

    // Role definitions
    uint64 public constant VENDOR_ROLE = uint64(uint256(keccak256("VENDOR_ROLE")) & 0xF);
    uint64 public constant CUSTOMER_ROLE = uint64(uint256(keccak256("CUSTOMER_ROLE")) & 0xF);

    // bytes4 private constant ADD_PRODUCT_SELECTOR = bytes4(keccak256("addProduct(string,uint256)"));
    // bytes4 private constant PURCHASE_PRODUCT_SELECTOR = bytes4(keccak256("purchaseProduct(uint256)"));


    constructor(address initialAdmin) AccessManager(initialAdmin) {}









     // ============================================= FUNCTION MANAGEMENT ==============================================







    // Function to interact with roles
    function grantRole(uint64 roleId, address account) external onlyAuthorized() {
        grantRole(roleId, account, 0);
    }


    function revokeRole(uint64 roleId, address account) public override onlyAuthorized() {
        revokeRole(roleId, account);
    }

    function renounceRole(uint64 roleId, address account) public override {
        renounceRole(roleId, account);
    }

    // Set the role required to call certain functions
    function setTargetFunctionRole(address target, bytes4[] calldata selectors, uint64 roleId) public override onlyAuthorized() {
        setTargetFunctionRole(target, selectors, roleId);
    }



    // Function to set the closed flag for a contract
    function setTargetClosed(address target, bool closed) public override onlyAuthorized() {
        // Implement 
    }
}