// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title PromptGrid NFT Contract
 * @author PromptGrid Team
 * @dev Implementation of the LSP8 standard for prompts as NFTs
 */

// modules
import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";

// constants
import {_LSP8_TOKENID_FORMAT_NUMBER} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

// libraries
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title PromptGridNFT
 * @dev Implementation of LSP8 standard for PromptGrid NFTs
 * Each prompt created by creators is minted as an NFT
 */
contract PromptGridNFT is LSP8Mintable {
    // Listing fee structure based on prompt type
    mapping(uint256 => uint256) public listingFees;

    // Platform fee percentage (default 10%)
    uint256 public platformFeePercentage = 10;

    // Prompt types: 1 = Text, 2 = Image, 3 = Audio, 4 = Video
    uint256 public constant TEXT_PROMPT = 1;
    uint256 public constant IMAGE_PROMPT = 2;
    uint256 public constant AUDIO_PROMPT = 3;
    uint256 public constant VIDEO_PROMPT = 4;

    // Counter for token IDs
    uint256 private _tokenIdCounter = 0;

    // Prompt metadata structure
    struct Prompt {
        uint256 promptType;
        string name;
        string description;
        uint256 price; // 0 for free prompts
        address creator;
        bool isActive;
    }

    // Mapping from tokenId to Prompt details
    mapping(bytes32 => Prompt) public prompts;

    // Mapping to track total prompts created by an address
    mapping(address => uint256) public creatorPromptCount;

    // Events
    event PromptCreated(
        bytes32 indexed tokenId,
        address indexed creator,
        uint256 promptType,
        uint256 price
    );
    event PromptPurchased(
        bytes32 indexed tokenId,
        address indexed buyer,
        uint256 price
    );
    event PromptDeactivated(bytes32 indexed tokenId);
    event ListingFeeUpdated(uint256 promptType, uint256 newFee);
    event PlatformFeeUpdated(uint256 newPercentage);

    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner
    )
        LSP8Mintable(
            nftCollectionName,
            nftCollectionSymbol,
            contractOwner,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_NUMBER
        )
    {
        // Initialize listing fees based on PRD recommendations
        listingFees[TEXT_PROMPT] = 5 ether; // 5 LYX for Text Prompts
        listingFees[IMAGE_PROMPT] = 8 ether; // 8 LYX for Image Prompts
        listingFees[AUDIO_PROMPT] = 10 ether; // 10 LYX for Audio Prompts
        listingFees[VIDEO_PROMPT] = 15 ether; // 15 LYX for Video Prompts
    }

    /**
     * @dev Creates a new prompt as an NFT
     * @param _promptType The type of prompt (1=Text, 2=Image, 3=Audio, 4=Video)
     * @param _name The prompt name
     * @param _description The description of the prompt
     * @param _price The price for using the prompt (0 for free)
     */
    function createPrompt(
        uint256 _promptType,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory metadata
    ) external payable returns (bytes32) {
        // Validate prompt type
        require(
            _promptType >= TEXT_PROMPT && _promptType <= VIDEO_PROMPT,
            "Invalid prompt type"
        );

        // Check if the listing fee is correct
        require(
            msg.value >= listingFees[_promptType],
            "Insufficient listing fee"
        );

        // Generate incremental tokenId
        _tokenIdCounter++;
        bytes32 tokenId = bytes32(uint256(_tokenIdCounter));

        // Create prompt struct
        Prompt memory newPrompt = Prompt({
            promptType: _promptType,
            name: _name,
            description: _description,
            price: _price,
            creator: msg.sender,
            isActive: true
        });

        // Store the prompt details
        prompts[tokenId] = newPrompt;

        // Increment creator prompt count
        creatorPromptCount[msg.sender]++;

        // Mint the NFT to the creator
        _mint(msg.sender, tokenId, true, "");

        // Set the metadata for the token
        _setDataForTokenId(
            tokenId,
            _LSP4_METADATA_KEY,
            getMetadata(metadata)
        );

        emit PromptCreated(tokenId, msg.sender, _promptType, _price);

        return tokenId;
    }

    /**
     * @dev Allows users to purchase and use a prompt
     * @param _tokenId The tokenId of the prompt to purchase
     */
    function purchasePrompt(bytes32 _tokenId) external payable {
        Prompt memory prompt = prompts[_tokenId];

        // Validate prompt
        require(prompt.isActive, "Prompt is not active");
        require(prompt.price > 0, "Prompt is free to use");
        require(msg.value >= prompt.price, "Insufficient payment");

        // Calculate the fee split based on platform fee percentage
        uint256 creatorShare = (prompt.price * (100 - platformFeePercentage)) / 100;
        // Platform fee is automatically kept in the contract

        // Transfer the creator's share
        payable(prompt.creator).transfer(creatorShare);

        emit PromptPurchased(_tokenId, msg.sender, prompt.price);
    }

    /**
     * @dev Deactivates a prompt (only callable by the creator)
     * @param _tokenId The tokenId of the prompt to deactivate
     */
    function deactivatePrompt(bytes32 _tokenId) external {
        Prompt storage prompt = prompts[_tokenId];

        // Only the creator can deactivate their prompt
        require(prompt.creator == msg.sender, "Not the creator");
        require(prompt.isActive, "Prompt already inactive");

        prompt.isActive = false;

        emit PromptDeactivated(_tokenId);
    }

    /**
     * @dev Updates the listing fee for a prompt type (only callable by the owner)
     * @param _promptType The type of prompt
     * @param _newFee The new listing fee
     */
    function updateListingFee(
        uint256 _promptType,
        uint256 _newFee
    ) external onlyOwner {
        require(
            _promptType >= TEXT_PROMPT && _promptType <= VIDEO_PROMPT,
            "Invalid prompt type"
        );

        listingFees[_promptType] = _newFee;

        emit ListingFeeUpdated(_promptType, _newFee);
    }

    /**
     * @dev Updates the platform fee percentage (only callable by the owner)
     * @param _newPercentage The new platform fee percentage
     */
    function updatePlatformFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 100, "Percentage must be between 0 and 100");
        platformFeePercentage = _newPercentage;
        emit PlatformFeeUpdated(_newPercentage);
    }

    /**
     * @dev Returns details about a specific prompt
     * @param _tokenId The tokenId of the prompt
     */
    function getPromptDetails(
        bytes32 _tokenId
    )
        external
        view
        returns (
            uint256 promptType,
            string memory name,
            string memory description,
            uint256 price,
            address creator,
            bool isActive
        )
    {
        Prompt memory prompt = prompts[_tokenId];
        return (
            prompt.promptType,
            prompt.name,
            prompt.description,
            prompt.price,
            prompt.creator,
            prompt.isActive
        );
    }

    /**
     * @dev Withdraws contract balance to the owner
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        payable(owner()).transfer(balance);
    }

    function getMetadata(string memory metadata) public pure returns (bytes memory) {
        bytes memory verfiableURI = bytes.concat(hex"00006f357c6a0020", keccak256(bytes(metadata)), abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(metadata))));
        return verfiableURI;
    }
}
