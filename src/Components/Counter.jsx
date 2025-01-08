import { useState } from "react";
import { ethers } from "ethers";

const counterABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
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
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [error, setError] = useState("");

  const CONTRACT_ADDRESS = "0xFf91aCd4f34a8EC81535C88b76976D2F4A572F8b";

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
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Web3 Counter
      </h1>

      <div style={{ padding: "20px" }}>
        {!wallet ? (
          <button
            onClick={connectWallet}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#666",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Connected: {wallet}
            </div>

            {error && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                textAlign: "center",
                fontSize: "36px",
                fontWeight: "bold",
                padding: "16px 0",
              }}
            >
              {count}
            </div>

            {gasEstimate && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                Estimated gas fee: {parseFloat(gasEstimate).toFixed(8)} ETH
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <button
                onClick={handleDecrement}
                disabled={loading || count === 0}
                style={{
                  padding: "10px 20px",
                  backgroundColor: loading || count === 0 ? "#ccc" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading || count === 0 ? "not-allowed" : "pointer",
                }}
              >
                Decrease
              </button>

              <button
                onClick={handleIncrement}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: loading ? "#ccc" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Increase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterApp;
