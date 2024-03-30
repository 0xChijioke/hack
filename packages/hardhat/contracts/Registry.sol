//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


import "hardhat/console.sol";


import "@openzeppelin/contracts/access/manager/AccessManaged.sol";
// import "@openzeppelin/contracts/utils/stucts/EnumerableMap.sol";


import "./Manager.sol";


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
    Manager private managerContract;



    // Event emitted when an accounts is registered
    event AccountRegistration(address indexed accountsAddress, Role[] roles);

    
    constructor(address manager) AccessManaged(manager) {
        managerContract = Manager(manager); // Initialize your Manager contract
    }

    // ============================================= FUNCTION MANAGEMENT ==============================================

    function register(
        string memory name,
        Role[] memory roles,
        bytes32[] memory additionalAttributes,
        bytes32[] memory metadata
    ) external returns (uint256) {
        // require(userAddresses[msg.sender] == 0, "User already registered");

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
        unchecked {
                nextAccountId++;
            }

        emit AccountRegistration(msg.sender, roles);

        return newAccount.id;
    }



    function getAccountById(uint256 accountId) public view returns (Account memory) {
        require(accountId != 0, "Invalid account id");
        require(accounts[accountId].id != 0, "Invalid account id");
        return accounts[accountId];
    }



    function getAccount(address userAddress) external view returns (Account memory) {
        uint256 accountsId = userAddresses[userAddress];
        require(accountsId != 0, "User not registered");
        return accounts[accountsId];
    }


    // function getAllAccounts() external view returns (Account[] memory) {
    //     Account[] memory allAccounts = new Account[](nextAccountId - 1); // Exclude the zero index account

    //     for (uint256 i = 1; i < nextAccountId; i++) {
    //         allAccounts[i - 1] = accounts[i];
    //     }

    //     return allAccounts;
    // }




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