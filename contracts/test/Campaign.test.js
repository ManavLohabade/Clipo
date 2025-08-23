const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Campaign Contract", function () {
  let Campaign, MockUSDC, campaign, mockUSDC;
  let owner, brand, user1, user2, user3;
  let totalBudget, minDepositRatio, duration;

  beforeEach(async function () {
    [owner, brand, user1, user2, user3] = await ethers.getSigners();

    // Deploy MockUSDC
    MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy(owner.address);

    // Campaign parameters
    totalBudget = ethers.utils.parseUnits("10000", 6); // 10K USDC
    minDepositRatio = 1500; // 15%
    duration = 30 * 24 * 60 * 60; // 30 days

    // Deploy Campaign
    Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.deploy(
      brand.address,
      mockUSDC.address,
      totalBudget,
      minDepositRatio,
      duration
    );

    // Mint USDC to brand for testing
    const mintAmount = ethers.utils.parseUnits("100000", 6); // 100K USDC
    await mockUSDC.mint(brand.address, mintAmount);
  });

  describe("Deployment", function () {
    it("Should set correct initial values", async function () {
      expect(await campaign.brand()).to.equal(brand.address);
      expect(await campaign.rewardToken()).to.equal(mockUSDC.address);
      expect(await campaign.totalBudget()).to.equal(totalBudget);
      expect(await campaign.minDepositRatio()).to.equal(minDepositRatio);
      expect(await campaign.campaignDuration()).to.equal(duration);
      expect(await campaign.campaignState()).to.equal(0); // ACTIVE
      expect(await campaign.owner()).to.equal(owner.address);
    });

    it("Should initialize milestones correctly", async function () {
      const milestones = await campaign.getMilestones();
      expect(milestones.length).to.equal(4);
      
      // Check first milestone
      expect(milestones[0].engagementThreshold).to.equal(15);
      expect(milestones[0].fundingRequired).to.equal(totalBudget.mul(25).div(100));
      expect(milestones[0].unlocked).to.equal(false);
    });
  });

  describe("Initial Deposit", function () {
    it("Should allow brand to make initial deposit", async function () {
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
      
      expect(await campaign.poolBalance()).to.equal(initialDeposit);
    });

    it("Should reject insufficient initial deposit", async function () {
      const insufficientDeposit = totalBudget.mul(1000).div(10000); // 10%
      
      await mockUSDC.connect(brand).approve(campaign.address, insufficientDeposit);
      
      await expect(
        campaign.connect(brand).initialDeposit(insufficientDeposit)
      ).to.be.revertedWith("Campaign: insufficient initial deposit");
    });

    it("Should reject multiple initial deposits", async function () {
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
      
      await expect(
        campaign.connect(brand).initialDeposit(initialDeposit)
      ).to.be.revertedWith("Campaign: already deposited");
    });
  });

  describe("Progressive Funding", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
    });

    it("Should allow brand to deposit more funds", async function () {
      const additionalDeposit = ethers.utils.parseUnits("1000", 6);
      
      await mockUSDC.connect(brand).approve(campaign.address, additionalDeposit);
      await campaign.connect(brand).depositMore(additionalDeposit);
      
      expect(await campaign.poolBalance()).to.equal(
        totalBudget.mul(minDepositRatio).div(10000).add(additionalDeposit)
      );
    });

    it("Should unlock milestones when conditions are met", async function () {
      // Submit engagement to reach 15% threshold
      const engagementScore = totalBudget.mul(15).div(100);
      await campaign.connect(owner).submitEngagement(user1.address, engagementScore, "https://example.com/post1");
      
      // Check if first milestone is unlocked
      const milestones = await campaign.getMilestones();
      expect(milestones[0].unlocked).to.equal(true);
    });
  });

  describe("Engagement Submission", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
    });

    it("Should allow admin to submit engagement", async function () {
      const score = ethers.utils.parseUnits("100", 6);
      const postUrl = "https://example.com/post1";
      
      await campaign.connect(owner).submitEngagement(user1.address, score, postUrl);
      
      const userStats = await campaign.getUserStats(user1.address);
      expect(userStats.totalScore).to.equal(score);
      expect(userStats.submissionCount).to.equal(1);
    });

    it("Should reject non-admin engagement submission", async function () {
      const score = ethers.utils.parseUnits("100", 6);
      const postUrl = "https://example.com/post1";
      
      await expect(
        campaign.connect(user1).submitEngagement(user1.address, score, postUrl)
      ).to.be.revertedWith("Campaign: only admin can call");
    });

    it("Should reject engagement for blacklisted users", async function () {
      // Blacklist user first
      await campaign.connect(owner).blacklistUser(user1.address, "Spam content");
      
      const score = ethers.utils.parseUnits("100", 6);
      const postUrl = "https://example.com/post1";
      
      await expect(
        campaign.connect(owner).submitEngagement(user1.address, score, postUrl)
      ).to.be.revertedWith("Campaign: user is blacklisted");
    });
  });

  describe("Reward Calculation", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
    });

    it("Should calculate rewards correctly", async function () {
      const score1 = ethers.utils.parseUnits("100", 6);
      const score2 = ethers.utils.parseUnits("200", 6);
      
      // Submit engagement for two users
      await campaign.connect(owner).submitEngagement(user1.address, score1, "https://example.com/post1");
      await campaign.connect(owner).submitEngagement(user2.address, score2, "https://example.com/post2");
      
      // Calculate rewards
      const rewards1 = await campaign.calculateRewards(user1.address);
      const rewards2 = await campaign.calculateRewards(user2.address);
      
      // User1 should get 1/3 of pool, User2 should get 2/3
      const poolBalance = await campaign.poolBalance();
      expect(rewards1).to.equal(poolBalance.mul(1).div(3));
      expect(rewards2).to.equal(poolBalance.mul(2).div(3));
    });

    it("Should return zero rewards for users with no engagement", async function () {
      const rewards = await campaign.calculateRewards(user1.address);
      expect(rewards).to.equal(0);
    });
  });

  describe("Reward Withdrawal", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
      
      // Submit engagement
      const score = ethers.utils.parseUnits("100", 6);
      await campaign.connect(owner).submitEngagement(user1.address, score, "https://example.com/post1");
    });

    it("Should allow users to withdraw rewards", async function () {
      const initialBalance = await mockUSDC.balanceOf(user1.address);
      const rewards = await campaign.calculateRewards(user1.address);
      
      await campaign.connect(user1).withdrawRewards();
      
      const finalBalance = await mockUSDC.balanceOf(user1.address);
      expect(finalBalance.sub(initialBalance)).to.equal(rewards);
    });

    it("Should reject withdrawal for blacklisted users", async function () {
      // Blacklist user
      await campaign.connect(owner).blacklistUser(user1.address, "Spam content");
      
      await expect(
        campaign.connect(user1).withdrawRewards()
      ).to.be.revertedWith("Campaign: user is blacklisted");
    });

    it("Should reject withdrawal with no rewards", async function () {
      // User2 has no engagement
      await expect(
        campaign.connect(user2).withdrawRewards()
      ).to.be.revertedWith("Campaign: no rewards to withdraw");
    });
  });

  describe("Campaign Management", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
    });

    it("Should allow admin to pause campaign", async function () {
      await campaign.connect(owner).emergencyPause();
      expect(await campaign.campaignState()).to.equal(1); // PAUSED
    });

    it("Should allow admin to resume campaign", async function () {
      await campaign.connect(owner).emergencyPause();
      await campaign.connect(owner).resumeCampaign();
      expect(await campaign.campaignState()).to.equal(0); // ACTIVE
    });

    it("Should allow brand to cancel campaign", async function () {
      const initialBalance = await mockUSDC.balanceOf(brand.address);
      
      await campaign.connect(brand).cancelCampaign();
      expect(await campaign.campaignState()).to.equal(3); // CANCELLED
      
      // Check if funds are refunded
      const finalBalance = await mockUSDC.balanceOf(brand.address);
      expect(finalBalance.gt(initialBalance)).to.be.true;
    });

    it("Should allow admin to complete campaign", async function () {
      // Submit enough engagement to reach 100%
      const engagementScore = totalBudget;
      await campaign.connect(owner).submitEngagement(user1.address, engagementScore, "https://example.com/post1");
      
      await campaign.connect(owner).completeCampaign();
      expect(await campaign.campaignState()).to.equal(2); // COMPLETED
    });
  });

  describe("User Management", function () {
    it("Should allow admin to blacklist users", async function () {
      await campaign.connect(owner).blacklistUser(user1.address, "Spam content");
      
      const userStats = await campaign.getUserStats(user1.address);
      expect(userStats.isBlacklisted).to.equal(true);
    });

    it("Should allow admin to remove users from blacklist", async function () {
      await campaign.connect(owner).blacklistUser(user1.address, "Spam content");
      await campaign.connect(owner).removeFromBlacklist(user1.address);
      
      const userStats = await campaign.getUserStats(user1.address);
      expect(userStats.isBlacklisted).to.equal(false);
    });
  });

  describe("Campaign Statistics", function () {
    beforeEach(async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
    });

    it("Should return correct campaign stats", async function () {
      const stats = await campaign.getCampaignStats();
      expect(stats.state).to.equal(0); // ACTIVE
      expect(stats.balance).to.equal(totalBudget.mul(minDepositRatio).div(10000));
      expect(stats.engagement).to.equal(0);
      expect(stats.milestone).to.equal(0);
    });

    it("Should return correct user stats", async function () {
      const score = ethers.utils.parseUnits("100", 6);
      await campaign.connect(owner).submitEngagement(user1.address, score, "https://example.com/post1");
      
      const userStats = await campaign.getUserStats(user1.address);
      expect(userStats.totalScore).to.equal(score);
      expect(userStats.submissionCount).to.equal(1);
      expect(userStats.isBlacklisted).to.equal(false);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero engagement correctly", async function () {
      const rewards = await campaign.calculateRewards(user1.address);
      expect(rewards).to.equal(0);
    });

    it("Should handle very large engagement scores", async function () {
      // Make initial deposit
      const initialDeposit = totalBudget.mul(minDepositRatio).div(10000);
      await mockUSDC.connect(brand).approve(campaign.address, initialDeposit);
      await campaign.connect(brand).initialDeposit(initialDeposit);
      
      const largeScore = ethers.utils.parseUnits("1000000", 6); // 1M USDC
      await campaign.connect(owner).submitEngagement(user1.address, largeScore, "https://example.com/post1");
      
      const rewards = await campaign.calculateRewards(user1.address);
      expect(rewards.gt(0)).to.be.true;
    });
  });
});
