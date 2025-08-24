// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Campaign.sol";

/**
 * @title CampaignFactory
 * @dev Factory contract for deploying new campaign contracts
 */
contract CampaignFactory is Ownable {
    // Campaign registry
    struct CampaignInfo {
        address campaignAddress;
        address brand;
        address rewardToken;
        uint256 totalBudget;
        uint256 createdAt;
        bool active;
    }

    // Campaign array and mapping
    CampaignInfo[] public campaigns;
    mapping(address => uint256) public campaignIndex;
    mapping(address => bool) public isCampaign;
    mapping(address => address[]) public brandCampaigns;

    // Supported reward tokens
    mapping(address => bool) public supportedTokens;
    
    // Events
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed brand,
        address indexed rewardToken,
        uint256 totalBudget,
        uint256 campaignId
    );
    event CampaignDeactivated(address indexed campaignAddress);
    event TokenSupported(address indexed token, bool supported);

    // Modifiers
    modifier onlyValidToken(address token) {
        require(supportedTokens[token], "Factory: token not supported");
        _;
    }

    modifier onlyValidBrand(address brand) {
        require(brand != address(0), "Factory: invalid brand address");
        _;
    }

    /**
     * @dev Constructor
     * @param _admin Admin address
     */
    constructor(address _admin) Ownable(_admin) {}

    /**
     * @dev Create a new campaign
     * @param _brand Brand address
     * @param _rewardToken ERC20 token for rewards
     * @param _totalBudget Total campaign budget
     * @param _minDepositRatio Minimum deposit ratio (1500 = 15%)
     * @param _duration Campaign duration in seconds
     * @return campaignAddress Address of the deployed campaign
     */
    function createCampaign(
        address _brand,
        address _rewardToken,
        uint256 _totalBudget,
        uint256 _minDepositRatio,
        uint256 _duration
    ) external onlyValidBrand(_brand) onlyValidToken(_rewardToken) returns (address campaignAddress) {
        require(_totalBudget > 0, "Factory: invalid budget");
        require(_minDepositRatio >= 1000 && _minDepositRatio <= 5000, "Factory: invalid deposit ratio");
        require(_duration > 0, "Factory: invalid duration");

        // Deploy new campaign contract
        Campaign campaign = new Campaign(
            _brand,
            _rewardToken,
            _totalBudget,
            _minDepositRatio,
            _duration
        );

        campaignAddress = address(campaign);

        // Register campaign
        uint256 campaignId = campaigns.length;
        campaigns.push(CampaignInfo({
            campaignAddress: campaignAddress,
            brand: _brand,
            rewardToken: _rewardToken,
            totalBudget: _totalBudget,
            createdAt: block.timestamp,
            active: true
        }));

        // Update mappings
        campaignIndex[campaignAddress] = campaignId;
        isCampaign[campaignAddress] = true;
        brandCampaigns[_brand].push(campaignAddress);

        // Transfer ownership to admin
        campaign.transferOwnership(owner());

        emit CampaignCreated(campaignAddress, _brand, _rewardToken, _totalBudget, campaignId);
    }

    /**
     * @dev Get campaign information by address
     * @param _campaign Campaign address
     * @return info Campaign information
     */
    function getCampaignInfo(address _campaign) external view returns (CampaignInfo memory info) {
        require(isCampaign[_campaign], "Factory: campaign not found");
        uint256 index = campaignIndex[_campaign];
        return campaigns[index];
    }

    /**
     * @dev Get campaign information by ID
     * @param _campaignId Campaign ID
     * @return info Campaign information
     */
    function getCampaignById(uint256 _campaignId) external view returns (CampaignInfo memory info) {
        require(_campaignId < campaigns.length, "Factory: invalid campaign ID");
        return campaigns[_campaignId];
    }

    /**
     * @dev Get all campaigns for a brand
     * @param _brand Brand address
     * @return campaignAddresses Array of campaign addresses
     */
    function getBrandCampaigns(address _brand) external view returns (address[] memory campaignAddresses) {
        return brandCampaigns[_brand];
    }

    /**
     * @dev Get total number of campaigns
     * @return count Total campaign count
     */
    function getCampaignCount() external view returns (uint256 count) {
        return campaigns.length;
    }

    /**
     * @dev Get active campaigns
     * @return activeCampaigns Array of active campaign addresses
     */
    function getActiveCampaigns() external view returns (address[] memory activeCampaigns) {
        uint256 activeCount = 0;
        
        // Count active campaigns
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].active) {
                activeCount++;
            }
        }

        // Create array of active campaigns
        activeCampaigns = new address[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].active) {
                activeCampaigns[currentIndex] = campaigns[i].campaignAddress;
                currentIndex++;
            }
        }

        return activeCampaigns;
    }

    /**
     * @dev Deactivate a campaign
     * @param _campaign Campaign address
     */
    function deactivateCampaign(address _campaign) external onlyOwner {
        require(isCampaign[_campaign], "Factory: campaign not found");
        
        uint256 index = campaignIndex[_campaign];
        campaigns[index].active = false;
        
        emit CampaignDeactivated(_campaign);
    }

    /**
     * @dev Add supported reward token
     * @param _token Token address
     */
    function addSupportedToken(address _token) external onlyOwner {
        require(_token != address(0), "Factory: invalid token address");
        supportedTokens[_token] = true;
        emit TokenSupported(_token, true);
    }

    /**
     * @dev Remove supported reward token
     * @param _token Token address
     */
    function removeSupportedToken(address _token) external onlyOwner {
        require(_token != address(0), "Factory: invalid token address");
        supportedTokens[_token] = false;
        emit TokenSupported(_token, false);
    }

    /**
     * @dev Check if token is supported
     * @param _token Token address
     * @return supported Whether token is supported
     */
    function isTokenSupported(address _token) external view returns (bool supported) {
        return supportedTokens[_token];
    }

    /**
     * @dev Get campaign statistics
     * @return totalCampaigns Total number of campaigns
     * @return activeCampaigns Number of active campaigns
     * @return totalBudget Total budget across all campaigns
     */
    function getFactoryStats() external view returns (
        uint256 totalCampaigns,
        uint256 activeCampaigns,
        uint256 totalBudget
    ) {
        uint256 active = 0;
        uint256 budget = 0;
        
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].active) {
                active++;
                budget += campaigns[i].totalBudget;
            }
        }
        
        return (campaigns.length, active, budget);
    }

    /**
     * @dev Emergency function to pause all campaigns
     */
    function emergencyPauseAll() external onlyOwner {
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].active) {
                try Campaign(campaigns[i].campaignAddress).emergencyPause() {
                    // Campaign paused successfully
                } catch {
                    // Campaign might already be paused or completed
                }
            }
        }
    }
}
