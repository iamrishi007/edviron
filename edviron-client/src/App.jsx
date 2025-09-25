import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import TransactionsPage from "./pages/TransactionsPage";
import CreatePaymentPage from "./pages/CreatePaymentPage";
import CheckStatusPage from "./pages/CheckStatusPage";
import Home from "./pages/Home";
import SchoolTransactions from "./components/SchoolTransactions";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

function App() {
  const currentUser = getCurrentUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<TransactionsPage user={currentUser} />} />
        <Route path="create-payment" element={<CreatePaymentPage />} />
        <Route path="check-status" element={<CheckStatusPage user={currentUser} />} />
      </Route>

      <Route
        path="/transactions/school/:school_id"
        element={
          <PrivateRoute>
            <SchoolTransactions user={currentUser} />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
