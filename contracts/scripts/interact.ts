import { ethers } from "hardhat";

async function main() {
  // This script demonstrates how to interact with the PromptGrid contracts

  // First, get the deployed contract addresses
  const promptGridNFTAddress = "0x9f705aA97e9734cb81c7B13488B600b9eAb1B4eD";
  const promptGridMarketplaceAddress = "0x4e27a4c736E70A8A93ed162E2Ad1667C6B29108e";

  // Get signers
  const [creator, user1] = await ethers.getSigners();

  console.log("Getting contract instances...");

  // Get contract instances
  const promptGridNFT = await ethers.getContractAt("PromptGridNFT", promptGridNFTAddress);
  const promptGridMarketplace = await ethers.getContractAt("PromptGridMarketplace", promptGridMarketplaceAddress);

  console.log("Connected to PromptGrid contracts!");

  // Update listing fees
  console.log("\n1. Updating listing fees...");

  // Define new listing fees
  const TEXT_PROMPT = 1;
  const IMAGE_PROMPT = 2;
  const AUDIO_PROMPT = 3;
  const VIDEO_PROMPT = 4;

  try {
    // Update listing fees (only contract owner can do this)
    await promptGridNFT.updateListingFee(TEXT_PROMPT, ethers.parseEther("0.005"));
    await promptGridNFT.updateListingFee(IMAGE_PROMPT, ethers.parseEther("0.008"));
    await promptGridNFT.updateListingFee(AUDIO_PROMPT, ethers.parseEther("0.010"));
    await promptGridNFT.updateListingFee(VIDEO_PROMPT, ethers.parseEther("0.015"));

    console.log("Listing fees updated successfully!");

    // Verify the new listing fees
    const textPromptFee = await promptGridNFT.listingFees(TEXT_PROMPT);
    const imagePromptFee = await promptGridNFT.listingFees(IMAGE_PROMPT);
    const audioPromptFee = await promptGridNFT.listingFees(AUDIO_PROMPT);
    const videoPromptFee = await promptGridNFT.listingFees(VIDEO_PROMPT);

    console.log(`New TEXT_PROMPT fee: ${ethers.formatEther(textPromptFee)} LYX`);
    console.log(`New IMAGE_PROMPT fee: ${ethers.formatEther(imagePromptFee)} LYX`);
    console.log(`New AUDIO_PROMPT fee: ${ethers.formatEther(audioPromptFee)} LYX`);
    console.log(`New VIDEO_PROMPT fee: ${ethers.formatEther(videoPromptFee)} LYX`);

    // Simulate a creator creating a prompt
    console.log("\n2. Creator creates a prompt...");

    const promptType = 1; // Text prompt
    const name = "Creative Writing";
    const description = "Create a poetic description of a futuristic city where nature and technology have merged harmoniously.";
    const price = ethers.parseEther("0.1"); // 0.1 LYX to use this prompt
    const listingFee = ethers.parseEther("0.005"); // Updated listing fee for text prompts

    const metadata = JSON.stringify({
      LSP4Metadata: {
        name: "Test Prompt",
        description: "This is a test prompt",
        links: [
          { title: "Try it out", url: "https://promptgrid.xyz/grid/:id" },
        ],
        attributes: [
          { key: "Type", value: "text" },
          { key: "Model", value: "claude" },
          { key: "Version", value: "claude-3-5-sonnet" },
        ],
        icon: [],
        backgroundImage: [],
        assets: [],
        images: [],
      },
    });

    const createTx = await promptGridNFT.connect(creator).createPrompt(
      promptType,
      description,
      name,
      price,
      metadata,
      { value: listingFee }
    );

    const createReceipt = await createTx.wait();

    // Get the tokenId from the event
    const events = await promptGridNFT.queryFilter(
      promptGridNFT.filters.PromptCreated(),
      createReceipt?.blockNumber,
      createReceipt?.blockNumber
    );

    const tokenId = events[0].args[0];
    console.log(`Prompt created with tokenId: ${tokenId}`);

    // Get prompt details
    const promptDetails = await promptGridNFT.getPromptDetails(tokenId);
    console.log("Prompt Details:");
    console.log(`- Type: ${promptDetails[0]}`);
    console.log(`- description: ${promptDetails[1]}`);
    console.log(`- name: ${promptDetails[2]}`);
    console.log(`- Price: ${ethers.formatEther(promptDetails[3])} LYX`);
    console.log(`- Creator: ${promptDetails[4]}`);
    console.log(`- Active: ${promptDetails[5]}`);

    // Simulate a user purchasing the prompt
    console.log("\n3. User purchases the prompt...");

    const purchaseTx = await promptGridMarketplace.connect(user1).purchasePrompt(
      tokenId,
      { value: price }
    );

    await purchaseTx.wait();
    console.log(`User ${user1.address} purchased the prompt!`);

    // Verify the user has purchased the prompt
    const hasPurchased = await promptGridMarketplace.hasPurchased(user1.address, tokenId);
    console.log(`Has user purchased the prompt? ${hasPurchased}`);

    // Simulate the user rating the prompt
    console.log("\n4. User rates the prompt...");

    const ratingTx = await promptGridMarketplace.connect(user1).ratePrompt(
      tokenId,
      5, // 5 stars
      "This is an excellent prompt! It helped me create engaging and vivid descriptions."
    );

    await ratingTx.wait();
    console.log("User rated the prompt!");

    // Get the ratings
    const ratings = await promptGridMarketplace.getPromptRatings(tokenId, 0, 10);
    console.log("Prompt Ratings:");
    for (let i = 0; i < ratings[0].length; i++) {
      console.log(`- Stars: ${ratings[0][i]}`);
      console.log(`- Review: ${ratings[1][i]}`);
      console.log(`- Rater: ${ratings[2][i]}`);
      console.log(`- Timestamp: ${new Date(Number(ratings[3][i]) * 1000).toISOString()}`);
    }

    // Get average rating
    const avgRating = await promptGridMarketplace.getAverageRating(tokenId);
    console.log(`Average Rating: ${Number(avgRating) / 10} stars`); // Divide by 10 for decimal poin

    console.log("\nSimulation complete!");

  } catch (error) {
    console.error("Error during simulation:", error);
  }
}

// Execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
