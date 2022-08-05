// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Balloons", {
    from: deployer,
    log: true,
  });

  const balloons = await ethers.getContract("Balloons", deployer);

  await deploy("DEX", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [balloons.address],
    log: true,
    waitConfirmations: 5,
  });

  const dex = await ethers.getContract("DEX", deployer);

  // paste in your front-end address here to get 10 balloons on deploy:
  await balloons.transfer(
    "0x883Ad5d32ca28F98844aF5c221026Eaf5Ed39fdc",
    "" + 10 * 10 ** 18
  );

  // // uncomment to init DEX on deploy:
  console.log(
    "Approving DEX (" + dex.address + ") to take Balloons from main account..."
  );
  // If you are going to the testnet make sure your deployer account has enough ETH
  await balloons.approve(dex.address, ethers.utils.parseEther("5"));
  console.log("INIT exchange...");
  await dex.init(ethers.utils.parseEther("5"), {
    value: ethers.utils.parseEther("5"),
    gasLimit: 200000,
  });
};
module.exports.tags = ["Balloons", "DEX"];
