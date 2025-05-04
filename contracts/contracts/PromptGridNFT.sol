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
import {_LSP4_TOKEN_TYPE_COLLECTION} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

/**
 * @title PromptGridNFT
 * @dev Implementation of LSP8 standard for PromptGrid NFTs
 * Each prompt created by creators is minted as an NFT
 */
contract PromptGridNFT is LSP8Mintable {
    // Listing fee structure based on prompt type
    mapping(uint256 => uint256) public listingFees;

    // Prompt types: 1 = Text, 2 = Image, 3 = Audio, 4 = Video
    uint256 public constant TEXT_PROMPT = 1;
    uint256 public constant IMAGE_PROMPT = 2;
    uint256 public constant AUDIO_PROMPT = 3;
    uint256 public constant VIDEO_PROMPT = 4;

    // Prompt metadata structure
    struct Prompt {
        uint256 promptType;
        string content;
        string category;
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
     * @param _promptType The type of prompt (1=Text, 2=Image, 3=Audio/Video)
     * @param _content The prompt content or IPFS hash to content
     * @param _category The category of the prompt
     * @param _price The price for using the prompt (0 for free)
     */
    function createPrompt(
        uint256 _promptType,
        string memory _content,
        string memory _category,
        uint256 _price
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

        // Generate tokenId based on creator, type and timestamp
        bytes32 tokenId = bytes32(
            uint256(
                keccak256(
                    abi.encodePacked(msg.sender, _promptType, block.timestamp)
                )
            )
        );

        // Create prompt struct
        Prompt memory newPrompt = Prompt({
            promptType: _promptType,
            content: _content,
            category: _category,
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

        // Transfer the payment to the creator
        payable(prompt.creator).transfer(prompt.price);

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
            string memory content,
            string memory category,
            uint256 price,
            address creator,
            bool isActive
        )
    {
        Prompt memory prompt = prompts[_tokenId];
        return (
            prompt.promptType,
            prompt.content,
            prompt.category,
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
}
