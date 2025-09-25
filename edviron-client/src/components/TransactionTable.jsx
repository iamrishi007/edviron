import React, { useState, useMemo } from "react";
import "../style/dashboard.css";

export default function TransactionTable({ transactions }) {
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filtered = useMemo(() => {
    if (!searchTerm) return transactions;
    return transactions.filter(
      (tx) =>
        (tx.student_info?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.custom_order_id || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal =
        sortField === "student_info" ? a.student_info?.name || "" : a[sortField];
      let bVal =
        sortField === "student_info" ? b.student_info?.name || "" : b[sortField];
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filtered, sortField, sortOrder]);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage]);

  const columns = [
    { key: "collect_id", label: "COLLECT ID" },
    { key: "school_id", label: "SCHOOL ID" },
    { key: "school_name", label: "SCHOOL NAME" },
    { key: "gateway", label: "GATEWAY" },
    { key: "order_amount", label: "ORDER AMOUNT" },
    { key: "transaction_amount", label: "TRANSACTION AMOUNT" },
    { key: "status", label: "STATUS" },
    { key: "custom_order_id", label: "CUSTOM ORDER ID" },
  ];

  return (
    <>
      <div>
        <input
          placeholder="Search by Student or Order ID"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />
        <table className="transaction-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: "pointer" }}>
                  {col.label} {sortField === col.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx) => (

              <tr key={tx.collect_id}>
                <td>{tx.collect_id}</td>
                <td>{tx.school_id}</td>
                <td>{tx.school_name || "-"}</td>
                <td>{tx.gateway || "-"}</td>
                <td>{tx.order_amount || "-"}</td>
                <td>{tx.transaction_amount || "-"}</td>
                <td>{tx.status || "-"}</td>
                <td>{tx.custom_order_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    </>
  );
}
