import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/PaymentSuccess.module.css";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.subtitle}>
          Your order has been placed successfully.
        </p>
        <button
          onClick={() => navigate("/cart")}
          className={styles.homeBtn}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}