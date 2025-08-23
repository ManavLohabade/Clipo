// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Campaign
 * @dev Smart contract for managing campaign engagement and reward distribution
 */
contract Campaign is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Campaign state
    enum CampaignState {
        ACTIVE,
        PAUSED,
        COMPLETED,
        CANCELLED
    }

    // Funding milestones
    struct Milestone {
        uint256 engagementThreshold;
        uint256 fundingRequired;
        bool unlocked;
    }

    // User submission
    struct Submission {
        string postUrl;
        uint256 engagementScore;
        bool approved;
        uint256 timestamp;
    }

    // Campaign parameters
    address public immutable brand;
    IERC20 public immutable rewardToken;
    uint256 public immutable totalBudget;
    uint256 public immutable minDepositRatio; // 15% = 1500 (basis points)
    uint256 public immutable campaignDuration;
    uint256 public immutable startTime;

    // Campaign state
    CampaignState public campaignState;
    uint256 public poolBalance;
    uint256 public totalEngagementScore;
    uint256 public currentMilestone;

    // Milestones for progressive funding
    Milestone[] public milestones;
    
    // User mappings
    mapping(address => Submission[]) public userSubmissions;
    mapping(address => uint256) public userTotalScore;
    mapping(address => uint256) public userRewards;
    mapping(address => bool) public blacklistedUsers;

    // Events
    event CampaignCreated(
        address indexed brand,
        uint256 totalBudget,
        uint256 minDeposit,
        uint256 duration
    );
    event MilestoneUnlocked(uint256 milestoneIndex, uint256 fundingRequired);
    event SubmissionSubmitted(address indexed user, string postUrl);
    event EngagementUpdated(address indexed user, uint256 score);
    event RewardsDistributed(address indexed user, uint256 amount);
    event CampaignPaused(address indexed brand);
    event CampaignResumed(address indexed brand);
    event CampaignCompleted(uint256 totalRewardsDistributed);
    event UserBlacklisted(address indexed user, string reason);

    // Modifiers
    modifier onlyBrand() {
        require(msg.sender == brand, "Campaign: only brand can call");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner(), "Campaign: only admin can call");
        _;
    }

    modifier campaignActive() {
        require(campaignState == CampaignState.ACTIVE, "Campaign: not active");
        _;
    }

    modifier userNotBlacklisted(address user) {
        require(!blacklistedUsers[user], "Campaign: user is blacklisted");
        _;
    }

    /**
     * @dev Constructor to create a new campaign
     * @param _brand Address of the brand creating the campaign
     * @param _rewardToken ERC20 token for rewards
     * @param _totalBudget Total budget for the campaign
     * @param _minDepositRatio Minimum deposit ratio (1500 = 15%)
     * @param _duration Campaign duration in seconds
     */
    constructor(
        address _brand,
        address _rewardToken,
        uint256 _totalBudget,
        uint256 _minDepositRatio,
        uint256 _duration
    ) Ownable(msg.sender) {
        require(_brand != address(0), "Campaign: invalid brand address");
        require(_rewardToken != address(0), "Campaign: invalid token address");
        require(_totalBudget > 0, "Campaign: invalid budget");
        require(_minDepositRatio >= 1000 && _minDepositRatio <= 5000, "Campaign: invalid deposit ratio");
        require(_duration > 0, "Campaign: invalid duration");

        brand = _brand;
        rewardToken = IERC20(_rewardToken);
        totalBudget = _totalBudget;
        minDepositRatio = _minDepositRatio;
        campaignDuration = _duration;
        startTime = block.timestamp;
        campaignState = CampaignState.ACTIVE;

        // Initialize milestones
        _initializeMilestones();

        emit CampaignCreated(_brand, _totalBudget, _minDepositRatio, _duration);
    }

    /**
     * @dev Initialize funding milestones
     */
    function _initializeMilestones() private {
        // Milestone 1: 15% engagement → 25% funding
        milestones.push(Milestone({
            engagementThreshold: 15, // 15%
            fundingRequired: (totalBudget * 25) / 100,
            unlocked: false
        }));

        // Milestone 2: 35% engagement → 30% funding
        milestones.push(Milestone({
            engagementThreshold: 35, // 35%
            fundingRequired: (totalBudget * 30) / 100,
            unlocked: false
        }));

        // Milestone 3: 60% engagement → 25% funding
        milestones.push(Milestone({
            engagementThreshold: 60, // 60%
            fundingRequired: (totalBudget * 25) / 100,
            unlocked: false
        }));

        // Milestone 4: 85% engagement → 15% funding
        milestones.push(Milestone({
            engagementThreshold: 85, // 85%
            fundingRequired: (totalBudget * 15) / 100,
            unlocked: false
        }));
    }

    /**
     * @dev Initial deposit from brand (minimum 15%)
     * @param amount Initial deposit amount
     */
    function initialDeposit(uint256 amount) external onlyBrand campaignActive {
        require(amount >= (totalBudget * minDepositRatio) / 10000, "Campaign: insufficient initial deposit");
        require(poolBalance == 0, "Campaign: already deposited");

        poolBalance = amount;
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev Brand can deposit more funds to unlock next milestone
     * @param amount Amount to deposit
     */
    function depositMore(uint256 amount) external onlyBrand campaignActive {
        require(amount > 0, "Campaign: invalid amount");
        require(currentMilestone < milestones.length, "Campaign: all milestones unlocked");

        poolBalance += amount;
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);

        // Check if milestone can be unlocked
        _checkMilestoneUnlock();
    }

    /**
     * @dev Check and unlock milestones based on engagement progress
     */
    function _checkMilestoneUnlock() private {
        uint256 progressPercent = (totalEngagementScore * 100) / totalBudget;
        
        while (currentMilestone < milestones.length && 
               progressPercent >= milestones[currentMilestone].engagementThreshold) {
            
            if (poolBalance >= milestones[currentMilestone].fundingRequired) {
                milestones[currentMilestone].unlocked = true;
                emit MilestoneUnlocked(currentMilestone, milestones[currentMilestone].fundingRequired);
                currentMilestone++;
            } else {
                // Pause campaign if insufficient funds
                _pause();
                emit CampaignPaused(brand);
                break;
            }
        }
    }

    /**
     * @dev Admin submits engagement score for a user
     * @param user Address of the user
     * @param score Engagement score
     * @param postUrl URL of the post
     */
    function submitEngagement(
        address user,
        uint256 score,
        string calldata postUrl
    ) external onlyAdmin campaignActive userNotBlacklisted(user) {
        require(user != address(0), "Campaign: invalid user address");
        require(score > 0, "Campaign: invalid score");

        // Add submission
        userSubmissions[user].push(Submission({
            postUrl: postUrl,
            engagementScore: score,
            approved: true,
            timestamp: block.timestamp
        }));

        // Update user total score
        userTotalScore[user] += score;
        totalEngagementScore += score;

        emit EngagementUpdated(user, score);

        // Check milestone unlock
        _checkMilestoneUnlock();
    }

    /**
     * @dev Calculate rewards for a user based on their engagement score
     * @param user Address of the user
     * @return rewards Calculated rewards
     */
    function calculateRewards(address user) public view returns (uint256 rewards) {
        if (totalEngagementScore == 0) return 0;
        
        uint256 userScore = userTotalScore[user];
        if (userScore == 0) return 0;

        // Calculate proportional rewards
        rewards = (poolBalance * userScore) / totalEngagementScore;
        return rewards;
    }

    /**
     * @dev User withdraws their earned rewards
     */
    function withdrawRewards() external nonReentrant userNotBlacklisted(msg.sender) {
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "Campaign: no rewards to withdraw");

        // Update user rewards
        userRewards[msg.sender] += rewards;
        userTotalScore[msg.sender] = 0; // Reset score after withdrawal

        // Transfer rewards
        rewardToken.safeTransfer(msg.sender, rewards);

        emit RewardsDistributed(msg.sender, rewards);
    }

    /**
     * @dev Admin can blacklist users for spam/fake engagement
     * @param user Address to blacklist
     * @param reason Reason for blacklisting
     */
    function blacklistUser(address user, string calldata reason) external onlyAdmin {
        require(user != address(0), "Campaign: invalid user address");
        blacklistedUsers[user] = true;
        emit UserBlacklisted(user, reason);
    }

    /**
     * @dev Admin can remove users from blacklist
     * @param user Address to remove from blacklist
     */
    function removeFromBlacklist(address user) external onlyAdmin {
        require(user != address(0), "Campaign: invalid user address");
        blacklistedUsers[user] = false;
    }

    /**
     * @dev Resume campaign after pause
     */
    function resumeCampaign() external onlyAdmin {
        require(campaignState == CampaignState.PAUSED, "Campaign: not paused");
        _unpause();
        campaignState = CampaignState.ACTIVE;
        emit CampaignResumed(brand);
    }

    /**
     * @dev Complete campaign when goals are met
     */
    function completeCampaign() external onlyAdmin {
        require(campaignState == CampaignState.ACTIVE, "Campaign: not active");
        require(totalEngagementScore >= totalBudget, "Campaign: goals not met");
        
        campaignState = CampaignState.COMPLETED;
        emit CampaignCompleted(poolBalance);
    }

    /**
     * @dev Brand can cancel campaign and get refund
     */
    function cancelCampaign() external onlyBrand {
        require(campaignState == CampaignState.ACTIVE || campaignState == CampaignState.PAUSED, "Campaign: cannot cancel");
        
        campaignState = CampaignState.CANCELLED;
        
        // Refund remaining balance to brand
        if (poolBalance > 0) {
            uint256 refundAmount = poolBalance;
            poolBalance = 0;
            rewardToken.safeTransfer(brand, refundAmount);
        }
    }

    /**
     * @dev Get campaign statistics
     */
    function getCampaignStats() external view returns (
        CampaignState state,
        uint256 balance,
        uint256 engagement,
        uint256 milestone,
        uint256 timeRemaining
    ) {
        uint256 endTime = startTime + campaignDuration;
        uint256 remaining = block.timestamp >= endTime ? 0 : endTime - block.timestamp;
        
        return (
            campaignState,
            poolBalance,
            totalEngagementScore,
            currentMilestone,
            remaining
        );
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalScore,
        uint256 totalRewards,
        uint256 submissionCount,
        bool isBlacklisted
    ) {
        return (
            userTotalScore[user],
            userRewards[user],
            userSubmissions[user].length,
            blacklistedUsers[user]
        );
    }

    /**
     * @dev Get milestone information
     */
    function getMilestones() external view returns (Milestone[] memory) {
        return milestones;
    }

    /**
     * @dev Emergency pause by admin
     */
    function emergencyPause() external onlyAdmin {
        _pause();
        campaignState = CampaignState.PAUSED;
        emit CampaignPaused(brand);
    }

    /**
     * @dev Override pause function to update state
     */
    function _pause() internal override {
        super._pause();
        campaignState = CampaignState.PAUSED;
    }

    /**
     * @dev Override unpause function to update state
     */
    function _unpause() internal override {
        super._unpause();
        campaignState = CampaignState.ACTIVE;
    }
}
