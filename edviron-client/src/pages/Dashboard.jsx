import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../services/api";
import Header from "../components/Header";
import TransactionTable from "../components/TransactionTable";
import "../style/global.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (schoolFilter) params.school_id = schoolFilter;
      const res = await getAllTransactions(params);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, schoolFilter]);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        {/* <aside className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li onClick={fetchTransactions}>All Transactions</li>
            <li
              onClick={() =>
                document
                  .getElementById("create-payment")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Create Payment
            </li>
          </ul>
        </aside> */}

        <main className="main-content">
          {/* Filter Section */}


          {/* Enhanced Transactions Table */}
          <section className="table-section">
            <TransactionTable transactions={transactions} />
          </section>

          {/* Payment Form */}
         
        </main>
      </div>
    </>
  );
}
