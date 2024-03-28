//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;




import "@openzeppelin/contracts/access/manager/AccessManaged.sol";


contract VendorOps is AccessManaged {
    

    constructor(address manager) AccessManaged(manager) {}


}