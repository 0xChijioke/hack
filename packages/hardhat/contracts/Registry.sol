//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


import "@openzeppelin/contracts/access/manager/AccessManaged.sol";
// import "@openzeppelin/contracts/utils/stucts/EnumerableMap.sol";



contract Registry is AccessManaged {
    
    

    enum Role { Vendor, Customer, Admin }


    struct Account {
        uint256 id;
        string name;
        Role[] roles;
        uint256 createdAt;
        uint256 lastModifiedAt;
        bytes32[] attributes; // Account-specific attributes
        bytes32[] metadata; // Additional metadata
        uint256[] relatedEntities; // Related accounts IDs
        address[] verifiedAddresses; // List of verified addresses
    }


    mapping(address => uint256) private userAddresses;
    mapping(uint256 => Account) private accounts;
    uint256 private nextAccountId = 1;



    // Event emitted when an accounts is registered
    event AccountRegistration(address indexed accountsAddress, Role[] roles);

    
    constructor(address manager) AccessManaged(manager) {}

    // ============================================= FUNCTION MANAGEMENT ==============================================

    function register(
        string memory name,
        Role[] memory roles,
        bytes32[] memory additionalAttributes,
        bytes32[] memory metadata
    ) external returns (uint256) {
        require(userAddresses[msg.sender] == 0, "User already registered");

        // Create a new account for the user
        Account storage newAccount = accounts[nextAccountId];
        newAccount.id = nextAccountId;
        newAccount.name = name;
        newAccount.roles = roles;
        newAccount.createdAt = block.timestamp;
        newAccount.lastModifiedAt = block.timestamp;

        // Append additional attributes
        for (uint256 i = 0; i < additionalAttributes.length; i++) {
            newAccount.attributes.push(additionalAttributes[i]);
        }

        // Append entity metadata
        for (uint256 i = 0; i < metadata.length; i++) {
            newAccount.metadata.push(metadata[i]);
        }

        userAddresses[msg.sender] = nextAccountId;
        nextAccountId++;

        emit AccountRegistration(msg.sender, roles);

        return newAccount.id;
    }




    function getAccount(address userAddress) external restricted returns (Account memory) {
        uint256 accountsId = userAddresses[userAddress];
        require(accountsId != 0, "User not registered");
        return accounts[accountsId];
    }





    function bytes32ToString(bytes32 data) private pure returns (string memory) {
        bytes memory bytesData = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            bytesData[i] = data[i];
        }
        return string(bytesData);
    }





    function addVerifiedAddress(Account storage account, address verifiedAddress) internal {
        require(verifiedAddress != address(0), "Invalid address");
        require(!isAddressVerified(account, verifiedAddress), "Address already verified");

        account.verifiedAddresses.push(verifiedAddress);
    }

    function isAddressVerified(Account storage account, address verifiedAddress) internal view returns (bool) {
        for (uint256 i = 0; i < account.verifiedAddresses.length; i++) {
            if (account.verifiedAddresses[i] == verifiedAddress) {
                return true;
            }
        }
        return false;
    }
}


