# Clipo - Blockchain-Powered Campaign Engagement Platform

Clipo is a decentralized application built on the Avalanche blockchain that enables content creators to earn rewards for viral content through smart contracts. The platform connects brands with

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (for backend)
- Avalanche Fuji testnet (for smart contracts)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Clipo
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
# Copy and configure environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## 📁 Project Structure

```
Clipo/
├── backend/          # NestJS backend API
├── frontend/         # React frontend application
├── contracts/        # Solidity smart contracts
└── docs/            # Documentation
```

## 🛠️ Development

### Backend
```bash
cd backend
npm run start:dev
```

### Frontend
```bash
cd frontend
npm run dev
```

### Smart Contracts
```bash
cd contracts
npm run compile
npm run test
```

## 📚 Documentation

- [API Documentation](http://localhost:3001/api/docs)
- [Smart Contract Documentation](./contracts/README.md)
- [Frontend Component Library](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
