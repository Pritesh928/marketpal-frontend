import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./css/Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Browse products and add them to cart</p>
          <button
            onClick={() => navigate("/home")}
            className={styles.browseBtn}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Your Cart</h1>
          <button onClick={clearCart} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        <div className={styles.content}>

          <div className={styles.items}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.itemImage}
                  onClick={() => navigate(`/product/${item.id}`)}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                  }}
                />

                <div className={styles.itemDetails}>
                  <span className={styles.itemCategory}>{item.category}</span>
                  <h3
                    className={styles.itemTitle}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.title}
                  </h3>
                  <p className={styles.itemSeller}>@{item.sellerUsername}</p>
                </div>

                <div className={styles.itemRight}>
                  <span className={styles.itemPrice}>₹{item.price}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.summaryRow}>
                  <span className={styles.summaryItem}>{item.title}</span>
                  <span className={styles.summaryPrice}>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalPrice}>₹{cartTotal}</span>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className={styles.checkoutBtn}
            >
              Proceed to Payment
            </button>

            <button
              onClick={() => navigate("/home")}
              className={styles.continueBtn}
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}