import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PromptGrid contracts...");

  // Get the ContractFactory and Signer
  const [deployer] = await ethers.getSigners();

  // Deploy the PromptGridNFT contract
  const PromptGridNFT = await ethers.getContractFactory("PromptGridNFT");
  const promptGridNFT = await PromptGridNFT.deploy(
    "PromptGrid NFT Collection Test 2",   // Collection name
    "PGRIDTEST2",                       // Collection symbol
    deployer.address               // Contract owner
  );

  await promptGridNFT.waitForDeployment();
  const promptGridNFTAddress = await promptGridNFT.getAddress();
  console.log("PromptGridNFT deployed to:", promptGridNFTAddress);

  // Deploy the PromptGridMarketplace contract
  const PromptGridMarketplace = await ethers.getContractFactory("PromptGridMarketplace");
  const promptGridMarketplace = await PromptGridMarketplace.deploy(promptGridNFTAddress);

  await promptGridMarketplace.waitForDeployment();
  const promptGridMarketplaceAddress = await promptGridMarketplace.getAddress();
  console.log("PromptGridMarketplace deployed to:", promptGridMarketplaceAddress);

  // Log all contract addresses
  console.log("\nContract Addresses:");
  console.log("---------------------");
  console.log("PromptGridNFT:", promptGridNFTAddress);
  console.log("PromptGridMarketplace:", promptGridMarketplaceAddress);
  console.log("---------------------");

  console.log("Deployment complete!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
