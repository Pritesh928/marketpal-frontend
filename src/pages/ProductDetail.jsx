import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "./css/ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleAddToCart = () => {
  if (!isLoggedIn) {
    navigate("/login");
    return;
  }
    addToCart(product);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuy = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    alert("Payment feature coming soon!");
  };

  const handleEdit = () => navigate(`/edit-product/${id}`);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productAPI.delete(id);
      navigate("/my-products");
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  const isOwner = isLoggedIn && user?.username === product?.sellerUsername;

  if (loading) return (
    <div className={styles.center}>
      <div className={styles.spinner}></div>
    </div>
  );

  if (error) return (
    <div className={styles.center}>
      <p className={styles.errorText}>{error}</p>
      <button onClick={() => navigate("/home")} className={styles.backBtn}>
        Back to Home
      </button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <button onClick={() => navigate("/home")} className={styles.backBtn}>
          ← Back
        </button>

        <div className={styles.content}>

          <div className={styles.imageSection}>
            <img
              src={product.imageUrl}
              alt={product.title}
              className={styles.image}
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
          </div>

          <div className={styles.details}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>₹{product.price}</p>

            <div className={styles.seller}>
              <span className={styles.sellerLabel}>Listed by</span>
              <span className={styles.sellerName}>@{product.sellerUsername}</span>
            </div>

            <div className={styles.divider} />

            <p className={styles.description}>{product.description}</p>

            <div className={styles.divider} />

            {isOwner ? (
              <div className={styles.ownerActions}>
                <p className={styles.ownerNote}>This is your listing</p>
                <button onClick={handleEdit} className={styles.editBtn}>
                  Edit Product
                </button>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                  Delete Product
                </button>
              </div>
            ) : (
              <div className= {styles.buyActions}>
                <button
                onClick={handleAddToCart}
                className={isInCart(product?.id)}
                >
                  {isInCart(product?.id) ? "✓ Added to Cart" : "Add to Cart"}
                </button>
                <button onClick={handleBuy} className= {styles.buyBtn}>
                  {isLoggedIn ? "Buy Now" : "Login to Buy"}
                </button>
              </div>
            )}

            <p className={styles.listedAt}>
              Listed on {new Date(product.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}