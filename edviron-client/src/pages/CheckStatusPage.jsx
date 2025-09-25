import React, { useState } from "react";
import { checkTransactionStatus } from "../services/api";

export default function CheckStatusPage() {
  const [customOrderId, setCustomOrderId] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    const trimmed = customOrderId.trim();
    if (!trimmed) {
      setError("Please enter a valid Custom Order ID");
      return;
    }

    setError("");
    setTransaction(null);
    setLoading(true);

    try {
      const res = await checkTransactionStatus(trimmed);
      let data = res?.data;
     
      
      // ---- Data Normalization ----
      if (Array.isArray(data)) data = data[0];
      if (data?.transaction) data = data.transaction;

      // Flatten `status` object if it’s actually a full record
      if (data?.status && typeof data.status === "object") {
        data = { ...data, ...data.status };
        delete data.status;
      }

      setTransaction(data || null);
    } catch (err) {
      console.error("Transaction lookup failed:", err);
      setError(err?.response?.data?.message ?? "Transaction not found");
    } finally {
      setLoading(false);
    }
  };
  console.log(transaction);
  
  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        Check Payment Status by Custom Order ID
      </h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Custom Order ID"
          value={customOrderId}
          onChange={(e) => setCustomOrderId(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "4px",
            background: "#2563eb",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
      )}
      {transaction && (
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1rem 1.5rem",
            lineHeight: 1.5,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Transaction Details</h3>
          <Detail label="Custom Order ID" value={transaction.custom_order_id} />
          <Detail label="Status" value={transaction.status || "pending"} />
          <Detail label="Order Amount" value={transaction.order_amount} />
          <Detail label="Transaction Amount" value={transaction.transaction_amount} />
          <Detail label="collect_id" value={transaction.collect_id} />
          <Detail
            label="Payment Time"
            value={transaction.payment_time
              ? new Date(transaction.payment_time).toLocaleString()
              : "-"}
          />
          <Detail
            label="Created At"
            value={transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleString()
              : "-"}
          />

          {/* Optional collapsible raw payload for diagnostics */}
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 500 }}>
              Show raw payload
            </summary>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, marginTop: 8 }}>
              {JSON.stringify(transaction, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p style={{ margin: "0.25rem 0" }}>
      <strong style={{ display: "inline-block", width: 160 }}>
        {label}:
      </strong>
      <span>{value ?? "-"}</span>
    </p>
  );
}
