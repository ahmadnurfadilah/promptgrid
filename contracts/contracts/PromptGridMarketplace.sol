// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title PromptGrid Marketplace Contract
 * @author PromptGrid Team
 * @dev Implementation of the marketplace functionality including ratings and reviews
 */

import {PromptGridNFT} from "./PromptGridNFT.sol";

/**
 * @title PromptGridMarketplace
 * @dev Implementation of the PromptGrid marketplace with ratings and reviews
 */
contract PromptGridMarketplace {
    // Reference to the PromptGridNFT contract
    PromptGridNFT public nftContract;

    // Rating structure
    struct Rating {
        uint8 stars; // 1-5 stars
        string review; // Optional text review
        address rater;
        uint256 timestamp;
    }

    // Mapping from tokenId to array of ratings
    mapping(bytes32 => Rating[]) public promptRatings;

    // Mapping from tokenId to average rating (multiply by 10 for one decimal place precision)
    mapping(bytes32 => uint256) public promptAverageRating;

    // Mapping to track if a user has purchased a specific prompt
    mapping(address => mapping(bytes32 => bool)) public hasPurchased;

    // Mapping to track if a user has rated a specific prompt
    mapping(address => mapping(bytes32 => bool)) public hasRated;

    // Events
    event PromptRated(bytes32 indexed tokenId, address indexed rater, uint8 stars);
    event MarketplaceInitialized(address nftContractAddress);

    /**
     * @dev Constructor to set the NFT contract address
     * @param _nftContractAddress Address of the PromptGridNFT contract
     */
    constructor(address _nftContractAddress) {
        nftContract = PromptGridNFT(payable(_nftContractAddress));
        emit MarketplaceInitialized(_nftContractAddress);
    }

    /**
     * @dev Allows a user to purchase a prompt
     * @param _tokenId The tokenId of the prompt to purchase
     */
    function purchasePrompt(bytes32 _tokenId) external payable {
        // Forward call to the NFT contract
        nftContract.purchasePrompt{value: msg.value}(_tokenId);

        // Mark as purchased
        hasPurchased[msg.sender][_tokenId] = true;
    }

    /**
     * @dev Allows a user to rate and review a prompt they've purchased
     * @param _tokenId The tokenId of the prompt to rate
     * @param _stars Rating from 1-5 stars
     * @param _review Optional text review
     */
    function ratePrompt(bytes32 _tokenId, uint8 _stars, string memory _review) external {
        // Validate rating
        require(_stars >= 1 && _stars <= 5, "Rating must be between 1-5 stars");

        // Check if the user has purchased the prompt
        require(hasPurchased[msg.sender][_tokenId], "Must purchase prompt before rating");

        // Check if the user has already rated this prompt
        require(!hasRated[msg.sender][_tokenId], "Already rated this prompt");

        // Create new rating
        Rating memory newRating = Rating({
            stars: _stars,
            review: _review,
            rater: msg.sender,
            timestamp: block.timestamp
        });

        // Add rating to array
        promptRatings[_tokenId].push(newRating);

        // Mark user as having rated this prompt
        hasRated[msg.sender][_tokenId] = true;

        // Update average rating
        updateAverageRating(_tokenId);

        emit PromptRated(_tokenId, msg.sender, _stars);
    }

    /**
     * @dev Updates the average rating for a prompt
     * @param _tokenId The tokenId of the prompt
     */
    function updateAverageRating(bytes32 _tokenId) internal {
        Rating[] memory ratings = promptRatings[_tokenId];
        uint256 ratingCount = ratings.length;

        if (ratingCount == 0) {
            promptAverageRating[_tokenId] = 0;
            return;
        }

        uint256 totalStars = 0;
        for (uint256 i = 0; i < ratingCount; i++) {
            totalStars += ratings[i].stars;
        }

        // Calculate average with one decimal place precision (multiply by 10)
        promptAverageRating[_tokenId] = (totalStars * 10) / ratingCount;
    }

    /**
     * @dev Retrieves ratings for a prompt
     * @param _tokenId The tokenId of the prompt
     * @param _offset Pagination offset
     * @param _limit Maximum number of ratings to return
     */
    function getPromptRatings(bytes32 _tokenId, uint256 _offset, uint256 _limit)
        external
        view
        returns (
            uint8[] memory stars,
            string[] memory reviews,
            address[] memory raters,
            uint256[] memory timestamps,
            uint256 totalRatings
        )
    {
        Rating[] memory ratings = promptRatings[_tokenId];
        uint256 ratingCount = ratings.length;
        totalRatings = ratingCount;

        // If no ratings or invalid parameters, return empty arrays
        if (ratingCount == 0 || _offset >= ratingCount) {
            return (new uint8[](0), new string[](0), new address[](0), new uint256[](0), ratingCount);
        }

        // Calculate how many ratings to return
        uint256 resultCount = _limit;
        if (_offset + _limit > ratingCount) {
            resultCount = ratingCount - _offset;
        }

        // Initialize arrays
        stars = new uint8[](resultCount);
        reviews = new string[](resultCount);
        raters = new address[](resultCount);
        timestamps = new uint256[](resultCount);

        // Fill arrays with rating data
        for (uint256 i = 0; i < resultCount; i++) {
            Rating memory rating = ratings[_offset + i];
            stars[i] = rating.stars;
            reviews[i] = rating.review;
            raters[i] = rating.rater;
            timestamps[i] = rating.timestamp;
        }

        return (stars, reviews, raters, timestamps, ratingCount);
    }

    /**
     * @dev Gets the average rating for a prompt
     * @param _tokenId The tokenId of the prompt
     * @return Average rating with one decimal place (divided by 10)
     */
    function getAverageRating(bytes32 _tokenId) external view returns (uint256) {
        return promptAverageRating[_tokenId];
    }

    /**
     * @dev Gets the total number of ratings for a prompt
     * @param _tokenId The tokenId of the prompt
     */
    function getRatingCount(bytes32 _tokenId) external view returns (uint256) {
        return promptRatings[_tokenId].length;
    }
}
