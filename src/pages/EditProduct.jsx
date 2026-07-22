import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productAPI } from "../service/api";
import styles from "./css/Sell.module.css";

const CATEGORIES = [
  "3D Models",
  "Animation Packs",
  "Electronics",
  "Clothing",
  "Books",
  "Art & Design",
  "Music",
  "Software",
  "Gaming",
  "Other",
];

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // load existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        const p = response.data;
        setFormData({
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
        });
        setImagePreview(p.imageUrl); // show existing image
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl; // keep existing image

    const data = new FormData();
    data.append("file", imageFile);

    try {
      setUploading(true);
      const response = await productAPI.uploadImage(data);
      return response.data.imageUrl;
    } catch (err) {
      throw new Error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      await productAPI.update(id, {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl,
      });

      setSuccess("Product updated successfully!");
      setTimeout(() => navigate(`/product/${id}`), 1500);

    } catch (err) {
      setError(err.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: "flex", justifyContent: "center",
      alignItems: "center", minHeight: "60vh" }}>
      <div className={styles.spinner}></div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Edit Product</h1>
          <p className={styles.subtitle}>Update your product details</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* image */}
          <div className={styles.imageSection}>
            <label className={styles.imageLabel}>Product Image</label>
            <div
              className={styles.imageUpload}
              onClick={() => document.getElementById("imageInput").click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.preview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.uploadIcon}>🖼️</span>
                  <p>Click to change image</p>
                </div>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            {imagePreview && (
              <button
                type="button"
                className={styles.changeImage}
                onClick={() => document.getElementById("imageInput").click()}
              >
                Change Image
              </button>
            )}
          </div>

          {/* title */}
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
              maxLength={100}
            />
          </div>

          {/* description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              required
              rows={4}
            />
          </div>

          {/* price + category */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={styles.input}
                required
                min="1"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => navigate(`/product/${id}`)}
              className={styles.changeImage}
              style={{ flex: 1, padding: "13px", textAlign: "center" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || uploading}
              style={{ flex: 2 }}
            >
              {uploading
                ? "Uploading image..."
                : loading
                ? "Updating..."
                : "Update Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}