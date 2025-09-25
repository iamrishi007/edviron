import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../services/api";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (schoolFilter) params.school_id = schoolFilter;
      const res = await getAllTransactions(params);
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err.response || err);
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, schoolFilter]);

  return (
    <main className="main-content">
      <section className="filter-section" style={{ marginBottom: "1rem" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        {user?.role === "admin" && (
          <input
            type="text"
            placeholder="Filter by School ID"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.5rem" }}
          />
        )}
      </section>

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </main>
  );
}
