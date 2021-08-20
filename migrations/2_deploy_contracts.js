var SafeVault = artifacts.require("./SafeVault.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeVault);
};
