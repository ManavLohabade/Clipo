# Clipper DApp - Blockchain-Powered Campaign Engagement Platform

Clipper DApp is a decentralized application built on the Avalanche blockchain that enables content creators to earn rewards for viral content through smart contracts. The platform connects brands with content creators using a milestone-based funding system.

## 🚀 Features

- **Smart Contract Campaigns**: Deploy and manage campaigns on Avalanche
- **Milestone-Based Funding**: Progressive funding based on engagement metrics
- **Instant Rewards**: Automated reward distribution through smart contracts
- **Multi-Platform Support**: Twitter, Instagram, YouTube, and TikTok integration
- **Transparent System**: Blockchain-powered transparency and fairness
- **Modern UI/UX**: Beautiful, responsive interface with smooth animations

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts on Avalanche network
- **Backend**: NestJS API with TypeScript
- **Frontend**: Next.js 13 with React 18 and Tailwind CSS
- **Database**: SQLite with TypeORM
- **Web3**: Ethers.js integration for blockchain interaction

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or other Web3 wallet
- Avalanche testnet (Fuji) or mainnet access

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Clipper-DApp
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, frontend, contracts)
npm run install:all

# Or install individually:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../contracts && npm install
```

### 3. Environment Setup
```bash
# Backend
cd backend
cp env.example .env
# Edit .env with your configuration

# Contracts
cd ../contracts
cp env.example .env
# Edit .env with your private key and network settings
```

### 4. Compile Smart Contracts
```bash
cd contracts
npm run compile
```

## 🚀 Running the Application

### Development Mode
```bash
# Run both backend and frontend concurrently
npm run dev

# Or run individually:
npm run dev:backend    # Backend on port 3001
npm run dev:frontend   # Frontend on port 3000
```

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm run test
```

### Backend
```bash
cd backend
npm run test
```

## 📱 Usage

1. **Connect Wallet**: Connect your MetaMask or other Web3 wallet
2. **Browse Campaigns**: View available campaigns from brands
3. **Create Content**: Submit engaging content for campaigns
4. **Earn Rewards**: Get paid based on verified engagement metrics

## 🔧 Configuration

### Backend Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend server port (default: 3001)
- `JWT_SECRET`: Secret key for JWT tokens
- `AVALANCHE_NETWORK`: Network (fuji/mainnet)
- `ADMIN_PRIVATE_KEY`: Admin wallet private key

### Contract Environment Variables
- `PRIVATE_KEY`: Deployer private key
- `SNOWTRACE_API_KEY`: API key for contract verification

## 📊 Smart Contract Details

### CampaignFactory
- Factory pattern for deploying campaigns
- Campaign registry and management
- Supported token management

### Campaign
- Individual campaign management
- Milestone-based funding system
- Engagement tracking and rewards

### Milestone System
1. **15% engagement** → 25% funding
2. **35% engagement** → 30% funding
3. **60% engagement** → 25% funding
4. **85% engagement** → 15% funding

## 🌐 Networks

- **Fuji Testnet**: Chain ID 43113
- **Avalanche Mainnet**: Chain ID 43114

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:3001/api/docs`
- **Health Check**: `http://localhost:3001/api/v1/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Dependency Installation Failures**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Contract Compilation Errors**
   ```bash
   cd contracts
   npm run clean
   npm install
   npm run compile
   ```

3. **Backend Module Errors**
   ```bash
   cd backend
   npm run build
   ```

4. **Frontend Build Issues**
   ```bash
   cd frontend
   npm run build
   ```

### Getting Help

- Check the logs for detailed error messages
- Ensure all environment variables are set correctly
- Verify network connectivity and RPC endpoints
- Check Avalanche network status

## 🔗 Links

- **Avalanche Network**: https://www.avax.network/
- **Fuji Testnet**: https://docs.avax.network/quickstart/fuji-workflow
- **Snowtrace**: https://snowtrace.io/ (Mainnet) / https://testnet.snowtrace.io/ (Testnet)
- **Hardhat**: https://hardhat.org/
- **NestJS**: https://nestjs.com/
- **Next.js**: https://nextjs.org/
