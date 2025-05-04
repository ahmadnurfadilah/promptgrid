import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    // LUKSO Testnet
    luksoTestnet: {
      url: process.env.LUKSO_TESTNET_URL || "https://rpc.testnet.lukso.network",
      chainId: 4201,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    // LUKSO Mainnet
    luksoMainnet: {
      url: process.env.LUKSO_MAINNET_URL || "https://42.rpc.thirdweb.com",
      chainId: 42,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: 'no-api-key-needed',
    customChains: [
      {
        network: 'luksoTestnet',
        chainId: 4201,
        urls: {
          apiURL: 'https://api.explorer.execution.testnet.lukso.network/api',
          browserURL: 'https://explorer.execution.testnet.lukso.network/',
        },
      },
      {
        network: 'luksoMainnet',
        chainId: 42,
        urls: {
          apiURL: 'https://api.explorer.execution.mainnet.lukso.network/api',
          browserURL: 'https://explorer.execution.mainnet.lukso.network/',
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
