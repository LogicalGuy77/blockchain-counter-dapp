import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaMinus, FaPlus, FaEthereum } from "react-icons/fa";

const counterABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "newCount",
        type: "uint256",
      },
    ],
    name: "CountUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0xFf91aCd4f34a8EC81535C88b76976D2F4A572F8b";

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWallet(address);

        const counterContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          counterABI,
          signer
        );
        setContract(counterContract);

        const initialCount = await counterContract.getCount();
        setCount(initialCount.toNumber());
        updateGasEstimate(counterContract);
      }
    } catch (error) {
      setError("Failed to connect wallet: " + error.message);
    }
  };

  const updateGasEstimate = async (contractToUse) => {
    try {
      const gasEstimate = await contractToUse.estimateGas.increment();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const gasPrice = await provider.getGasPrice();
      const gasCost = gasEstimate.mul(gasPrice);
      setGasEstimate(ethers.utils.formatEther(gasCost));
    } catch (error) {
      console.error("Error estimating gas:", error);
    }
  };

  const handleIncrement = async () => {
    if (!contract) return;
    setLoading(true);
    setError("");
    try {
      const tx = await contract.increment();
      await tx.wait();
      const newCount = await contract.getCount();
      setCount(newCount.toNumber());
      updateGasEstimate(contract);
    } catch (error) {
      setError("Transaction failed: " + (error.reason || error.message));
    }
    setLoading(false);
  };

  const handleDecrement = async () => {
    if (!contract) return;
    setLoading(true);
    setError("");
    try {
      const tx = await contract.decrement();
      await tx.wait();
      const newCount = await contract.getCount();
      setCount(newCount.toNumber());
      updateGasEstimate(contract);
    } catch (error) {
      setError("Transaction failed: " + (error.reason || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Web3 Counter
        </h1>

        {!wallet ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition duration-200"
          >
            <FaWallet className="text-xl" />
            <span>Connect Wallet</span>
          </motion.button>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-gray-400 truncate">
              Connected: {wallet}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-900 text-red-200 p-4 rounded-md text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-6xl font-bold text-center text-white py-8"
            >
              {count}
            </motion.div>

            {gasEstimate && (
              <div className="text-center text-sm text-gray-400">
                <FaEthereum className="inline mr-1" />
                Estimated gas fee: {parseFloat(gasEstimate).toFixed(8)} ETH
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDecrement}
                disabled={loading || count === 0}
                className={`py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-2 transition duration-200 ${
                  loading || count === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <FaMinus />
                <span>Decrease</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleIncrement}
                disabled={loading}
                className={`py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-2 transition duration-200 ${
                  loading
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <FaPlus />
                <span>Increase</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CounterApp;
