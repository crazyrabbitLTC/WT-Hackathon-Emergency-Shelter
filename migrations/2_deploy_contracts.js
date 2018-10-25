var EmergencyShelterIndex = artifacts.require("EmergencyShelterIndex");
var WTIndex = artifacts.require("WTIndex");

module.exports = async function(deployer) {
  
  // Deploy WTIndex
  await deployer.deploy(WTIndex);
  console.log('>>>>> WTIndex Deployed <<<<<');
  const wTIndexInstance = await WTIndex.deployed();
  const wTIndexAddress = wTIndexInstance.address;
  
  // Deploy EmergencyShelterIndex
  await deployer.deploy(EmergencyShelterIndex, wTIndexAddress);
  console.log('>>>>> EmergencyShelterIndex Deployed <<<<<');
};
