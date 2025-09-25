import React, { useState, useEffect } from "react";
import { createPayment } from "../services/api";
import "../style/dashboard.css";
import { v4 as uuidv4 } from "uuid";

// Strong unique generator: UUID + timestamp
const generateOrderId = () =>
  "ORD-" +
  (uuidv4().replace(/-/g, "").slice(0, 12) + "-" + Date.now().toString().slice(-5)).toUpperCase();

export default function PaymentForm({ user, onPaymentCreated }) {
  const [paymentData, setPaymentData] = useState({
    school_id: "",
    school_name: "",
    order_amount: "",
    student_info: { name: "", id: "", email: "" },
    custom_order_id: generateOrderId(),
    callback_url: "https://edviron-server.onrender.com/webhook",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill school_id from logged-in user
  useEffect(() => {
    if (user?.school_id) {
      setPaymentData((p) => ({ ...p, school_id: user.school_id }));
    }
    if (user?.school_name) {
      setPaymentData((p) => ({ ...p, school_name: user.school_name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((p) => ({
      ...p,
      student_info: { ...p.student_info, [name]: value },
    }));
    setError("");
  };

  const resetForm = () =>
    setPaymentData({
      school_id: user?.school_id || "",
      school_name: user?.school_name || "",
      order_amount: "",
      student_info: { name: "", id: "", email: "" },
      custom_order_id: generateOrderId(),
      callback_url: "http://localhost:4000/webhook",
    });

  // Retry if duplicate key
  const tryCreateWithRetry = async (payload, maxRetries = 2) => {
    let lastErr = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        payload.custom_order_id = generateOrderId();
        setPaymentData((p) => ({ ...p, custom_order_id: payload.custom_order_id }));
      }
      try {
        return await createPayment(payload);
      } catch (err) {
        lastErr = err;
        const msg = String(
          err?.response?.data?.message || err?.response?.data || err?.message || ""
        );
        if (/duplicate|e11000/i.test(msg)) continue;
        throw err;
      }
    }
    throw lastErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!paymentData.school_id || !paymentData.school_name || !paymentData.order_amount) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const payload = {
      school_id: paymentData.school_id,
      school_name: paymentData.school_name,
      order_amount: Number(paymentData.order_amount),
      student_info: paymentData.student_info,
      custom_order_id: paymentData.custom_order_id,
      callback_url: paymentData.callback_url,
    };

    try {
      await tryCreateWithRetry(payload);
      alert("Payment created successfully!");
      onPaymentCreated && onPaymentCreated();
      resetForm();
    } catch (err) {
      console.error("Create payment error:", err);
      setError(err.response?.data?.message || "Payment creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-section">
      <h2>Create Payment</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="school_id"
          placeholder="School ID"
          value={paymentData.school_id}
          onChange={handleChange}
          required
        />
        <input
          name="school_name"
          placeholder="School Name"
          value={paymentData.school_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="order_amount"
          placeholder="Order Amount"
          value={paymentData.order_amount}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Student Name"
          value={paymentData.student_info.name}
          onChange={handleStudentChange}
          required
        />
        <input
          name="id"
          placeholder="Student ID"
          value={paymentData.student_info.id}
          onChange={handleStudentChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={paymentData.student_info.email}
          onChange={handleStudentChange}
          required
        />
        <input
          name="custom_order_id"
          value={paymentData.custom_order_id}
          readOnly
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
}
