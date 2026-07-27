import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../service/api";
import styles from "./css/Orders.module.css";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptyText}>
              Browse products and make your first purchase!
            </p>
            <button
              onClick={() => navigate("/home")}
              className={styles.browseBtn}
            >
              Browse Products
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className={styles.orders}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>

                <img
                  src={order.productImage}
                  alt={order.productTitle}
                  className={styles.productImage}
                  onClick={() => navigate(`/product/${order.id}`)}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=?";
                  }}
                />

                <div className={styles.orderInfo}>
                  <h3 className={styles.productTitle}>{order.productTitle}</h3>
                  <p className={styles.seller}>Sold by @{order.sellerUsername}</p>
                  <p className={styles.paymentId}>
                    Payment ID: {order.razorpayPaymentId}
                  </p>
                  <p className={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className={styles.orderRight}>
                  <span className={styles.amount}>₹{order.amount}</span>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}