var EmergencyShelterIndex = artifacts.require("EmergencyShelterIndex");

module.exports = function(deployer) {
  // deployer.deploy(WTIndex);
  deployer.deploy(EmergencyShelterIndex);
};
