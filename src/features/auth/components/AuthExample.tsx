import React, { useState } from "react";
import {
  useGetNonce,
  useVerifySignature,
  useIsAuthenticated,
  useLogout,
} from "../hooks/authHook";

/**
 * Example component demonstrating how to use the auth hooks
 * This shows the complete SIWE authentication flow
 */
export function AuthExample() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  // Auth hooks
  const {
    mutate: getNonce,
    data: nonceData,
    isPending: isGettingNonce,
  } = useGetNonce();
  const { mutate: verifySignature, isPending: isVerifying } =
    useVerifySignature();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();
  const { mutate: logout } = useLogout();

  const handleGetNonce = () => {
    if (!walletAddress) return;

    getNonce(
      { walletAddress },
      {
        onSuccess: (data) => {
          setMessage(data.message);
          console.log("Nonce received:", data.nonce);
          console.log("Message to sign:", data.message);
        },
        onError: (error) => {
          console.error("Failed to get nonce:", error);
        },
      }
    );
  };

  const handleVerifySignature = () => {
    if (!message || !signature) return;

    verifySignature(
      { message, signature },
      {
        onSuccess: (data) => {
          console.log("Authentication successful:", data.user);
        },
        onError: (error) => {
          console.error("Failed to verify signature:", error);
        },
      }
    );
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setWalletAddress("");
        setMessage("");
        setSignature("");
        console.log("Logged out successfully");
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Authenticated</h2>
        <p>Welcome, {user.walletAddress}</p>
        <p>User ID: {user.id}</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Authentication Example</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Wallet Address:
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleGetNonce}
          disabled={!walletAddress || isGettingNonce}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isGettingNonce ? "Getting Nonce..." : "Get Nonce"}
        </button>

        {message && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Message to Sign:
            </label>
            <textarea
              value={message}
              readOnly
              className="w-full p-2 border rounded h-24"
            />
          </div>
        )}

        {message && (
          <div>
            <label className="block text-sm font-medium mb-2">Signature:</label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {message && (
          <button
            onClick={handleVerifySignature}
            disabled={!signature || isVerifying}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify Signature"}
          </button>
        )}
      </div>
    </div>
  );
}
