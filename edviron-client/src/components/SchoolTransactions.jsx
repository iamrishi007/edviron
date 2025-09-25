import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import { getTransactionsBySchool } from "../services/api";

export default function SchoolTransactions({ user }) {
  const { school_id: routeSchoolId } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const schoolId = useMemo(() => {
    if (!user) return null;
    return user.role === "admin"
      ? routeSchoolId || user.selectedSchoolId
      : user.school_id;
  }, [user, routeSchoolId]);

  useEffect(() => {
    if (!schoolId) return;

    let isActive = true;
    setLoading(true);
    setError("");

    getTransactionsBySchool(schoolId)
      .then((res) => {
        if (isActive) setTransactions(res.data.data || []);
      })
      .catch((err) => {
        if (isActive) {
          setError(err.response?.data?.message || "Failed to fetch transactions");
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => (isActive = false);
  }, [schoolId]);

  if (!user) {
    return <p style={{ color: "red" }}>Please login to view school transactions.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Transactions for School: {schoolId}</h2>
      {loading && <p>Loading transactions…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <TransactionTable transactions={transactions} />}
    </div>
  );
}
