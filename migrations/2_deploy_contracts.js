const Nft = artifacts.require("ColexionTest");

module.exports = function(deployer) {
  deployer.deploy(Nft);
};
