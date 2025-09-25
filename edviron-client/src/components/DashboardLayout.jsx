import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="dashboard-container">
        <Outlet />
      </main>
    </>
  );
}
