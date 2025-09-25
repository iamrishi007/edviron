import React from "react";
import PaymentForm from "../components/PaymentForm";

export default function CreatePaymentPage({ user }) {
  const handlePaymentCreated = () => {
    console.log("Payment created – refresh logic can go here");
  };

  return (
    <main className="create-payment-page">
      <PaymentForm user={user} onPaymentCreated={handlePaymentCreated} />
    </main>
  );
}
