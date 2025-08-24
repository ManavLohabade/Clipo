const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance));

  // Deploy MockUSDC first
  console.log("\nDeploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy(deployer.address);
  await mockUSDC.deployed();
  console.log("MockUSDC deployed to:", mockUSDC.address);

  // Deploy CampaignFactory
  console.log("\nDeploying CampaignFactory...");
  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
  const campaignFactory = await CampaignFactory.deploy(deployer.address);
  await campaignFactory.deployed();
  console.log("CampaignFactory deployed to:", campaignFactory.address);

  // Add MockUSDC as supported token
  console.log("\nAdding MockUSDC as supported token...");
  const addTokenTx = await campaignFactory.addSupportedToken(mockUSDC.address);
  await addTokenTx.wait();
  console.log("MockUSDC added as supported token");

  // Mint some USDC to deployer for testing
  console.log("\nMinting USDC to deployer...");
  const mintAmount = ethers.utils.parseUnits("1000000", 6); // 1M USDC
  const mintTx = await mockUSDC.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log("Minted", ethers.utils.formatUnits(mintAmount, 6), "USDC to deployer");

  // Deploy a sample campaign
  console.log("\nDeploying sample campaign...");
  const brandAddress = deployer.address; // For testing, deployer is also the brand
  const totalBudget = ethers.utils.parseUnits("10000", 6); // 10K USDC
  const minDepositRatio = 1500; // 15%
  const duration = 30 * 24 * 60 * 60; // 30 days

  const createCampaignTx = await campaignFactory.createCampaign(
    brandAddress,
    mockUSDC.address,
    totalBudget,
    minDepositRatio,
    duration
  );
  const receipt = await createCampaignTx.wait();
  
  // Get campaign address from event
  const event = receipt.events.find(e => e.event === 'CampaignCreated');
  const campaignAddress = event.args.campaignAddress;
  console.log("Sample campaign deployed to:", campaignAddress);

  // Get campaign contract instance
  const Campaign = await ethers.getContractFactory("Campaign");
  const campaign = Campaign.attach(campaignAddress);

  // Make initial deposit
  console.log("\nMaking initial deposit...");
  const initialDeposit = ethers.utils.parseUnits("1500", 6); // 15% of 10K = 1.5K USDC
  
  // Approve USDC spending
  const approveTx = await mockUSDC.approve(campaign.address, initialDeposit);
  await approveTx.wait();
  
  // Make deposit
  const depositTx = await campaign.initialDeposit(initialDeposit);
  await depositTx.wait();
  console.log("Initial deposit completed");

  console.log("\n=== Deployment Summary ===");
  console.log("MockUSDC:", mockUSDC.address);
  console.log("CampaignFactory:", campaignFactory.address);
  console.log("Sample Campaign:", campaignAddress);
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);
  
  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      mockUSDC: mockUSDC.address,
      campaignFactory: campaignFactory.address,
      sampleCampaign: campaignAddress
    },
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\nDeployment info saved to deployment-${network.name}.json`);

  // Verify contracts on Snowtrace (if not localhost)
  if (network.name !== 'localhost' && network.name !== 'hardhat') {
    console.log("\nWaiting for block confirmation before verification...");
    await campaignFactory.deployTransaction.wait(6);
    
    try {
      console.log("Verifying CampaignFactory on Snowtrace...");
      await hre.run("verify:verify", {
        address: campaignFactory.address,
        constructorArguments: [deployer.address],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }

    try {
      console.log("Verifying MockUSDC on Snowtrace...");
      await hre.run("verify:verify", {
        address: mockUSDC.address,
        constructorArguments: [deployer.address],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
