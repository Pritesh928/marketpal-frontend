import React, { useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../service/api";
import { useAuth } from "../context/AuthContext";
import styles from "./css/Home.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products. Try refreshing.");
    } finally {
      setLoading(false);
    }
    }, []);

    useEffect(() => {
      fetchProducts();
    }, [fetchProducts]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      setSearching(true);
      const response = await productAPI.search(search.trim());
      setSearchResults(response.data);
    } catch (err) {
      setError("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults(null);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleSellClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/sell");
    }
  };

  const displayProducts = searchResults !== null ? searchResults : products;

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          buy or sell <span className={styles.accent}>anything :) </span>
        </h1>
        <p className={styles.heroSub}>
          from electronics products to lifestyle perks from 3d arts to 3d models everything can be listed here!!
        </p>
        <button onClick={handleSellClick} className={styles.heroBtn}>
          Gonna Try??
        </button>
      </div>

      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn} disabled={searching}>
            {searching ? "..." : "Search"}
          </button>
          {searchResults !== null && (
            <button type="button" onClick={clearSearch} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </form>
      </div>

      <div className={styles.content}>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {searchResults !== null
              ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`
              : "All Products"}
          </h2>
          {isLoggedIn && (
            <button onClick={handleSellClick} className={styles.sellBtn}>
              + List a Product
            </button>
          )}
        </div>

        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner}></div>
            <p>Loading products...</p>
          </div>
        )}

        {error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && displayProducts.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              {searchResults !== null
                ? "No products found for your search."
                : "No products listed yet. Be the first to sell >_<"}
            </p>
            <button onClick={handleSellClick} className={styles.heroBtn}>
              List a Product
            </button>
          </div>
        )}

        {!loading && displayProducts.length > 0 && (
          <div className={styles.grid}>
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className={styles.card}
                onClick={() => handleProductClick(product.id)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={styles.image}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x300?text=No+Image";
                    }}
                  />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{product.category}</span>
                  <h3 className={styles.cardTitle}>{product.title}</h3>
                  <p className={styles.cardDesc}>
                    {product.description.length > 80
                      ? product.description.substring(0, 80) + "..."
                      : product.description}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>₹{product.price}</span>
                    <span className={styles.seller}>@{product.sellerUsername}</span>
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