import { expect } from "chai";
import { ethers } from "hardhat";
import { PromptGridNFT, PromptGridMarketplace } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("PromptGrid", function () {
  let promptGridNFT: PromptGridNFT;
  let promptGridMarketplace: PromptGridMarketplace;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;

  // Constants for tests
  const TEXT_PROMPT = 1;
  const PROMPT_CONTENT = "Create a futuristic cityscape with neon lights and flying cars";
  const PROMPT_CATEGORY = "Image Generation";
  const PROMPT_PRICE = ethers.parseEther("0.1"); // 0.1 LYX
  const LISTING_FEE = ethers.parseEther("5"); // 5 LYX for text prompts

  beforeEach(async function () {
    // Get signers
    [owner, creator, buyer] = await ethers.getSigners();

    // Deploy PromptGridNFT
    const PromptGridNFTFactory = await ethers.getContractFactory("PromptGridNFT");
    promptGridNFT = await PromptGridNFTFactory.deploy(
      "PromptGrid NFT Collection",
      "PGRID",
      owner.address
    );

    // Deploy PromptGridMarketplace
    const PromptGridMarketplaceFactory = await ethers.getContractFactory("PromptGridMarketplace");
    promptGridMarketplace = await PromptGridMarketplaceFactory.deploy(await promptGridNFT.getAddress());
  });

  describe("NFT Contract", function () {
    it("Should initialize with correct name and symbol", async function () {
      expect(await promptGridNFT.name()).to.equal("PromptGrid NFT Collection");
      expect(await promptGridNFT.symbol()).to.equal("PGRID");
    });

    it("Should set correct listing fees", async function () {
      const textPromptFee = await promptGridNFT.listingFees(TEXT_PROMPT);
      expect(textPromptFee).to.equal(ethers.parseEther("5"));
    });

    it("Should create a prompt as NFT", async function () {
      // Create prompt from creator account
      const tx = await promptGridNFT.connect(creator).createPrompt(
        TEXT_PROMPT,
        PROMPT_CONTENT,
        PROMPT_CATEGORY,
        PROMPT_PRICE,
        { value: LISTING_FEE }
      );

      const receipt = await tx.wait();
      if (!receipt || !receipt.logs) {
        throw new Error("No logs in transaction receipt");
      }

      // Get the tokenId from the event logs
      // This is a simplification; in actual test you'd parse events correctly
      const events = await promptGridNFT.queryFilter(
        promptGridNFT.filters.PromptCreated(),
        receipt.blockNumber
      );

      expect(events.length).to.be.greaterThan(0);
      const tokenId = events[0].args[0];

      // Check prompt details
      const promptDetails = await promptGridNFT.getPromptDetails(tokenId);
      expect(promptDetails[0]).to.equal(TEXT_PROMPT);
      expect(promptDetails[1]).to.equal(PROMPT_CONTENT);
      expect(promptDetails[2]).to.equal(PROMPT_CATEGORY);
      expect(promptDetails[3]).to.equal(PROMPT_PRICE);
      expect(promptDetails[4]).to.equal(creator.address);
      expect(promptDetails[5]).to.be.true; // isActive

      // Check that creator's prompt count increased
      expect(await promptGridNFT.creatorPromptCount(creator.address)).to.equal(1);
    });
  });

  describe("Marketplace Contract", function () {
    let tokenId: string;

    beforeEach(async function () {
      // Create a prompt for testing marketplace functions
      const tx = await promptGridNFT.connect(creator).createPrompt(
        TEXT_PROMPT,
        PROMPT_CONTENT,
        PROMPT_CATEGORY,
        PROMPT_PRICE,
        { value: LISTING_FEE }
      );

      const receipt = await tx.wait();
      if (!receipt || !receipt.logs) {
        throw new Error("No logs in transaction receipt");
      }

      const events = await promptGridNFT.queryFilter(
        promptGridNFT.filters.PromptCreated(),
        receipt.blockNumber
      );

      tokenId = events[0].args[0];
    });

    it("Should allow purchasing a prompt", async function () {
      // Buyer purchases the prompt
      await promptGridMarketplace.connect(buyer).purchasePrompt(tokenId, { value: PROMPT_PRICE });

      // Check that buyer is marked as having purchased the prompt
      expect(await promptGridMarketplace.hasPurchased(buyer.address, tokenId)).to.be.true;
    });

    it("Should allow rating a purchased prompt", async function () {
      // Buyer purchases the prompt
      await promptGridMarketplace.connect(buyer).purchasePrompt(tokenId, { value: PROMPT_PRICE });

      // Buyer rates the prompt
      await promptGridMarketplace.connect(buyer).ratePrompt(tokenId, 5, "Excellent prompt!");

      // Check that rating was recorded
      expect(await promptGridMarketplace.hasRated(buyer.address, tokenId)).to.be.true;
      expect(await promptGridMarketplace.getRatingCount(tokenId)).to.equal(1);

      // Get the ratings
      const ratings = await promptGridMarketplace.getPromptRatings(tokenId, 0, 10);
      expect(ratings[0][0]).to.equal(5); // 5 stars
      expect(ratings[1][0]).to.equal("Excellent prompt!"); // Review text
      expect(ratings[2][0]).to.equal(buyer.address); // Rater address
    });
  });
});
