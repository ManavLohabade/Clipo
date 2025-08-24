import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import type { BigNumber } from 'ethers';

// Contract ABIs (simplified for brevity)
const CAMPAIGN_FACTORY_ABI = [
  'function createCampaign(address _brand, address _rewardToken, uint256 _totalBudget, uint256 _minDepositRatio, uint256 _duration) external returns (address)',
  'function getCampaignInfo(address _campaign) external view returns (tuple(address campaignAddress, address brand, address rewardToken, uint256 totalBudget, uint256 createdAt, bool active))',
  'function getActiveCampaigns() external view returns (address[])',
  'function getCampaignCount() external view returns (uint256)',
  'event CampaignCreated(address indexed campaignAddress, address indexed brand, address indexed rewardToken, uint256 totalBudget, uint256 campaignId)'
];

const CAMPAIGN_ABI = [
  'function initialDeposit(uint256 amount) external',
  'function depositMore(uint256 amount) external',
  'function submitEngagement(address user, uint256 score, string calldata postUrl) external',
  'function calculateRewards(address user) external view returns (uint256)',
  'function withdrawRewards() external',
  'function getCampaignStats() external view returns (uint8 state, uint256 balance, uint256 engagement, uint256 milestone, uint256 timeRemaining)',
  'function getUserStats(address user) external view returns (uint256 totalScore, uint256 totalRewards, uint256 submissionCount, bool isBlacklisted)',
  'function getMilestones() external view returns (tuple(uint256 engagementThreshold, uint256 fundingRequired, bool unlocked)[])',
  'function campaignState() external view returns (uint8)',
  'function poolBalance() external view returns (uint256)',
  'function totalEngagementScore() external view returns (uint256)',
  'function currentMilestone() external view returns (uint256)',
  'function brand() external view returns (address)',
  'function rewardToken() external view returns (address)',
  'function totalBudget() external view returns (uint256)',
  'function minDepositRatio() external view returns (uint256)',
  'function campaignDuration() external view returns (uint256)',
  'function startTime() external view returns (uint256)'
];

const ERC20_ABI = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)'
];

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private provider: ethers.providers.JsonRpcProvider;
  private campaignFactoryContract: ethers.Contract;
  private adminWallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.initializeWeb3();
  }

  private initializeWeb3() {
    try {
      // Initialize provider based on network
      const network = this.configService.get('AVALANCHE_NETWORK', 'fuji');
      const rpcUrl = network === 'mainnet' 
        ? 'https://api.avax.network/ext/bc/C/rpc'
        : 'https://api.avax-test.network/ext/bc/C/rpc';
      
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      
      // Initialize admin wallet
      const privateKey = this.configService.get('ADMIN_PRIVATE_KEY');
      if (privateKey && privateKey !== 'your_admin_private_key_here') {
        try {
          this.adminWallet = new ethers.Wallet(privateKey, this.provider);
          this.logger.log(`Admin wallet initialized: ${this.adminWallet.address}`);
        } catch (error) {
          this.logger.warn('Invalid admin private key, skipping wallet initialization');
        }
      } else {
        this.logger.warn('Admin private key not configured, wallet functionality disabled');
      }

      // Initialize campaign factory contract
      const factoryAddress = this.configService.get('CAMPAIGN_FACTORY_ADDRESS');
      if (factoryAddress && factoryAddress !== 'your-deployed-factory-address') {
        try {
          this.campaignFactoryContract = new ethers.Contract(
            factoryAddress,
            CAMPAIGN_FACTORY_ABI,
            this.provider
          );
          this.logger.log(`Campaign factory initialized: ${factoryAddress}`);
        } catch (error) {
          this.logger.warn('Invalid factory address, contract functionality disabled');
        }
      } else {
        this.logger.warn('Campaign factory address not configured, contract functionality disabled');
      }

      this.logger.log(`Web3 service initialized for ${network} network`);
    } catch (error) {
      this.logger.error('Failed to initialize Web3 service:', error);
    }
  }

  /**
   * Get provider instance
   */
  getProvider(): ethers.providers.JsonRpcProvider {
    return this.provider;
  }

  /**
   * Get admin wallet
   */
  getAdminWallet(): ethers.Wallet {
    return this.adminWallet;
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    brandAddress: string,
    rewardTokenAddress: string,
    totalBudget: string,
    minDepositRatio: number,
    duration: number
  ): Promise<string> {
    try {
      if (!this.adminWallet || !this.campaignFactoryContract) {
        throw new Error('Web3 service not properly initialized');
      }

      const contract = this.campaignFactoryContract.connect(this.adminWallet);
      
      const tx = await contract.createCampaign(
        brandAddress,
        rewardTokenAddress,
        ethers.utils.parseUnits(totalBudget, 6), // Assuming USDC with 6 decimals
        minDepositRatio,
        duration
      );

      const receipt = await tx.wait();
      
      // Extract campaign address from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'CampaignCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = contract.interface.parseLog(event);
        const campaignAddress = parsed.args.campaignAddress;
        this.logger.log(`Campaign created: ${campaignAddress}`);
        return campaignAddress;
      }

      throw new Error('Campaign creation event not found');
    } catch (error) {
      this.logger.error('Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Get campaign information
   */
  async getCampaignInfo(campaignAddress: string) {
    try {
      if (!this.campaignFactoryContract) {
        throw new Error('Campaign factory not initialized');
      }

      const info = await this.campaignFactoryContract.getCampaignInfo(campaignAddress);
      return {
        campaignAddress: info.campaignAddress,
        brand: info.brand,
        rewardToken: info.rewardToken,
        totalBudget: ethers.utils.formatUnits(info.totalBudget, 6),
        createdAt: new Date(Number(info.createdAt) * 1000),
        active: info.active
      };
    } catch (error) {
      this.logger.error('Failed to get campaign info:', error);
      throw error;
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignAddress: string) {
    try {
      const contract = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, this.provider);
      
      const stats = await contract.getCampaignStats();
      const milestones = await contract.getMilestones();
      
      return {
        state: this.getCampaignStateString(stats.state),
        balance: ethers.utils.formatUnits(stats.balance, 6),
        engagement: ethers.utils.formatUnits(stats.engagement, 6),
        milestone: Number(stats.milestone),
        timeRemaining: Number(stats.timeRemaining),
        milestones: milestones.map(m => ({
          engagementThreshold: Number(m.engagementThreshold),
          fundingRequired: ethers.utils.formatUnits(m.fundingRequired, 6),
          unlocked: m.unlocked
        }))
      };
    } catch (error) {
      this.logger.error('Failed to get campaign stats:', error);
      throw error;
    }
  }

  /**
   * Submit engagement score for a user
   */
  async submitEngagement(
    campaignAddress: string,
    userAddress: string,
    score: number,
    postUrl: string
  ): Promise<string> {
    try {
      if (!this.adminWallet) {
        throw new Error('Admin wallet not initialized');
      }

      const contract = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, this.adminWallet);
      
      const tx = await contract.submitEngagement(
        userAddress,
        ethers.utils.parseUnits(score.toString(), 6),
        postUrl
      );

      const receipt = await tx.wait();
      this.logger.log(`Engagement submitted for user ${userAddress}: ${score}`);
      
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to submit engagement:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(campaignAddress: string, userAddress: string) {
    try {
      const contract = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, this.provider);
      
      const stats = await contract.getUserStats(userAddress);
      const rewards = await contract.calculateRewards(userAddress);
      
      return {
        totalScore: ethers.utils.formatUnits(stats.totalScore, 6),
        totalRewards: ethers.utils.formatUnits(stats.totalRewards, 6),
        submissionCount: Number(stats.submissionCount),
        isBlacklisted: stats.isBlacklisted,
        currentRewards: ethers.utils.formatUnits(rewards, 6)
      };
    } catch (error) {
      this.logger.error('Failed to get user stats:', error);
      throw error;
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(tokenAddress: string) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.utils.formatUnits(totalSupply, Number(decimals))
      };
    } catch (error) {
      this.logger.error('Failed to get token info:', error);
      throw error;
    }
  }

  /**
   * Get active campaigns
   */
  async getActiveCampaigns(): Promise<string[]> {
    try {
      if (!this.campaignFactoryContract) {
        throw new Error('Campaign factory not initialized');
      }

      const campaigns = await this.campaignFactoryContract.getActiveCampaigns();
      return campaigns;
    } catch (error) {
      this.logger.error('Failed to get active campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign count
   */
  async getCampaignCount(): Promise<number> {
    try {
      if (!this.campaignFactoryContract) {
        throw new Error('Campaign factory not initialized');
      }

      const count = await this.campaignFactoryContract.getCampaignCount();
      return Number(count);
    } catch (error) {
      this.logger.error('Failed to get campaign count:', error);
      throw error;
    }
  }

  /**
   * Convert campaign state enum to string
   */
  private getCampaignStateString(state: number): string {
    const states = ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];
    return states[state] || 'UNKNOWN';
  }

  /**
   * Get network information
   */
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();
      
      return {
        chainId: Number(network.chainId),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice.gasPrice ? ethers.utils.formatUnits(gasPrice.gasPrice, 'gwei') : '0'
      };
    } catch (error) {
      this.logger.error('Failed to get network info:', error);
      throw error;
    }
  }

  /**
   * Deploy a new campaign (alias for createCampaign)
   */
  async deployCampaign(campaignData: any, userId: string): Promise<any> {
    try {
      const { brandAddress, rewardTokenAddress, totalBudget, minDepositRatio, duration } = campaignData;
      
      const campaignAddress = await this.createCampaign(
        brandAddress,
        rewardTokenAddress,
        totalBudget,
        minDepositRatio,
        duration
      );

      return {
        success: true,
        campaignAddress,
        deployedBy: userId,
        transactionHash: campaignAddress, // This should be the actual tx hash
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('Failed to deploy campaign:', error);
      throw error;
    }
  }

  /**
   * Distribute reward to a user
   */
  async distributeReward(rewardData: any, userId: string): Promise<any> {
    try {
      const { campaignAddress, userAddress, amount, tokenAddress } = rewardData;
      
      // For now, return mock data since we need to implement actual reward distribution
      // TODO: Implement actual reward distribution logic
      return {
        success: true,
        campaignAddress,
        userAddress,
        amount,
        tokenAddress,
        distributedBy: userId,
        timestamp: new Date(),
        transactionHash: `mock_tx_${Date.now()}`
      };
    } catch (error) {
      this.logger.error('Failed to distribute reward:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string): Promise<any> {
    try {
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();
      
      return {
        address,
        balance: ethers.utils.formatEther(balance),
        network: network.name,
        chainId: Number(network.chainId),
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('Failed to get balance:', error);
      throw error;
    }
  }
}
