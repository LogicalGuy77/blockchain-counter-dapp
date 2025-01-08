# Web3 Counter DApp

A decentralized application (DApp) that implements a simple counter stored on the Ethereum blockchain. Each user's counter value is stored separately based on their wallet address.

## Features

- Connect MetaMask wallet
- View current counter value
- Increment and decrement counter
- Real-time gas estimation
- Persisted counter values on the blockchain
- Network detection and validation
- Error handling and user feedback

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [MetaMask](https://metamask.io/) browser extension
- Some Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com))

## Technology Stack

- React.js - Frontend framework
- Solidity - Smart contract development
- ethers.js - Ethereum wallet integration
- MetaMask - Web3 wallet
- Sepolia Testnet - Ethereum test network

## Smart Contract Functions

### `getCount()`
- Returns the current counter value for the caller's address
- View function (no gas cost)

### `increment()`
- Increases the counter by 1
- Requires transaction signature and gas

### `decrement()`
- Decreases the counter by 1
- Requires transaction signature and gas
- Cannot decrease below 0

## Common Issues and Solutions

1. **"No Contract Found" Error**
   - Verify you're on Sepolia testnet
   - Check if contract address is correct
   - Ensure MetaMask is connected

2. **Transaction Failed**
   - Make sure you have enough Sepolia ETH for gas
   - Wait for previous transaction to complete
   - Check MetaMask network connection

3. **MetaMask Not Detected**
   - Install MetaMask browser extension
   - Reload the page after installation
