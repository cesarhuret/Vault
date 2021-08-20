// contracts/SafeVault.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

/// @title Creating the SafeVault
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title  Minting the SafeVault
/// @notice using ERC721 standards for the SafeVault
/// @author Kesar

contract SafeVault is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public totalVaults;
    mapping (address => uint256[]) vaultsIds;
    mapping(uint256 => Vault) public allVaults;
    event NewSafeVault(uint256 id, string VaultName);
    address owner;

    struct Password {
        string passwordName;
        string passwordString;
    }
    
    struct Vault {
        string name;
        uint256 vaultID;
        address owner;
        Password[] allPasswords;
    }
    
    
    constructor() ERC721("SafeVault", "TestV") {
        owner = msg.sender;
    }

    function mintVault(string memory name) payable public  {
        if(msg.value >= 0.0001 ether) {
            uint256 newVaultId = totalVaults.current();
    
            totalVaults.increment();  
    
            _safeMint(msg.sender, newVaultId);
            
            uint256[] storage allIds =  vaultsIds[msg.sender];
            allIds.push(newVaultId);
            
            Vault storage newVault = allVaults[newVaultId];
            newVault.name = name;
            newVault.vaultID = newVaultId;
            newVault.owner = msg.sender;
            
            emit NewSafeVault(newVaultId, newVault.name);
        }
    }

    function getVaultMetadata (uint256 vaultID) external view returns (string memory name, Password[] memory passwords) {
        Vault storage fetchedVault = allVaults[vaultID];
        require(msg.sender == fetchedVault.owner);
        name = fetchedVault.name;
        passwords = fetchedVault.allPasswords;
    }

    function getVaultName (uint256 vaultID) external view returns (string memory name) {
        Vault storage fetchedVault = allVaults[vaultID];
        require(msg.sender == fetchedVault.owner);
        name = fetchedVault.name;
    }
    
    function addPassword (uint256 vaultID, string memory newPasswordName, string memory newPassword) external {
        Vault storage fetchedVault = allVaults[vaultID];
        require(msg.sender == fetchedVault.owner);
        fetchedVault.allPasswords.push(Password(newPasswordName, newPassword));
    }
    
    function deletePassword (uint256 vaultID, uint256 passwordID) external {
        Vault storage fetchedVault = allVaults[vaultID];
        require(msg.sender == fetchedVault.owner);
        delete fetchedVault.allPasswords[passwordID];
    }
    
    function getBalance () external {
        require(msg.sender == owner);
        payable(msg.sender).transfer(address(this).balance);
    }
}