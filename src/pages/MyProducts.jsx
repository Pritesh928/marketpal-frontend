import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../service/api";
import styles from "./css/MyProducts.module.css";

export default function MyProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Listings</h1>
            <p className={styles.subtitle}>
              {products.length} product{products.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          <button
            onClick={() => navigate("/sell")}
            className={styles.addBtn}
          >
            + Add Product
          </button>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              You haven't listed anything yet.
            </p>
            <button
              onClick={() => navigate("/sell")}
              className={styles.addBtn}
            >
              List your first product
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.card}>

                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className={styles.image}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x200?text=No+Image";
                  }}
                />

                <div className={styles.cardBody}>
                  <span className={styles.category}>{product.category}</span>
                  <h3
                    className={styles.cardTitle}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.title}
                  </h3>
                  <p className={styles.price}>₹{product.price}</p>

                  <div className={styles.actions}>
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}