import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>SchoolPay Dashboard</h1>
      <nav>
        <NavLink to="/dashboard">Transactions</NavLink>
        <NavLink to="/dashboard/create-payment">Create Payment</NavLink>
        <NavLink to="/dashboard/check-status">Check Status</NavLink>
      </nav>
    </header>
  );
}
