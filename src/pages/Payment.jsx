import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { paymentAPI } from "../service/api";
import styles from "./css/Payment.module.css";

export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Failed to load payment gateway. Check your connection.");
        return;
      }
      const orderResponse = await paymentAPI.createOrder({
        productIds: cartItems.map((item) => item.id),
        totalAmount: cartTotal,
      });

      const { razorpayOrderId, amount, currency, keyId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency,
        name: "MarketPal",
        description: `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              productIds: cartItems.map((item) => item.id),
              totalAmount: cartTotal,
            });

            clearCart();
            navigate("/payment-success");
          } catch (err) {
            setError("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <button onClick={() => navigate("/cart")} className={styles.backBtn}>
          ← Back to Cart
        </button>

        <h1 className={styles.title}>Checkout</h1>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.content}>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            {cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.itemImage}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/60x60?text=?";
                  }}
                />
                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.itemSeller}>@{item.sellerUsername}</p>
                </div>
                <span className={styles.itemPrice}>₹{item.price}</span>
              </div>
            ))}

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Amount</span>
              <span className={styles.totalAmount}>₹{cartTotal}</span>
            </div>
          </div>

          <div className={styles.payCard}>
            <h2 className={styles.payTitle}>Payment</h2>
            <p className={styles.paySubtitle}>
              Secure payment powered by Razorpay
            </p>

            <div className={styles.secureNote}>
              🔒 Your payment is 100% secure
            </div>

            <div className={styles.totalDisplay}>
              <span>Total</span>
              <span className={styles.totalBig}>₹{cartTotal}</span>
            </div>

            <button
              onClick={handlePayment}
              className={styles.payBtn}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${cartTotal}`}
            </button>

            <p className={styles.disclaimer}>
              By proceeding, you agree to MarketPal's terms of service.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}