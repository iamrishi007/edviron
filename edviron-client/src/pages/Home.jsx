import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css"; // import custom CSS
import "../style/global.css"; // import custom CSS

export default function Home() {
  const navigate = useNavigate();

  return (
    <>

      <main className="home-container">
        <h1>Welcome to SchoolPay</h1>
        <p>Manage school payments efficiently and securely in one dashboard.</p>
        <button className="btn-primary" onClick={() => navigate("/register")}>
          Get Started
        </button>

      </main>
    </>
  );
}
