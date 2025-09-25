import React, { useState } from "react";
import { checkTransactionStatus } from "../services/api";

export default function CheckStatus() {
  const [customOrderId, setCustomOrderId] = useState("");
  const [status, setStatus] = useState("");

  const handleCheck = async () => {
    try {
      const res = await checkTransactionStatus(customOrderId);
      setStatus(res.data.status);
    } catch (err) {
      setStatus("Failed to fetch status");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto", background: "#111214", borderRadius: "8px", color: "#fff" }}>
      <h2>Check Transaction Status</h2>
      <input
        type="text"
        placeholder="Enter Custom Order ID"
        value={customOrderId}
        onChange={(e) => setCustomOrderId(e.target.value)}
        style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #222", backgroundColor: "#1b1c1f", color: "#fff" }}
      />
      <button onClick={handleCheck} style={{ width: "100%", padding: "0.9rem", backgroundColor: "#00aaff", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "bold" }}>
        Check Status
      </button>
      {status && <p style={{ marginTop: "1rem" }}>Status: {status}</p>}
    </div>
  );
}
