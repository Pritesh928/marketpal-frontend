import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function SellPage() {
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    if (!imageFile) return null;

    const data = new FormData();
    data.append("file", imageFile);

    try {
      setUploading(true);
      const response = await productAPI.uploadImage(data);
      return response.data.imageUrl;
    } catch (err) {
      throw new Error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!imageFile) {
      setError("Please select a product image.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage();
      if (!imageUrl) {
        setError("Image upload failed.");
        return;
      }

      await productAPI.create({
        ...formData,
        price: parseFloat(formData.price),
        imageUrl,
      });

      setSuccess("Product listed successfully!");
      setTimeout(() => navigate("/my-products"), 2000);

    } catch (err) {
      setError(err.message || err.response?.data?.error || "Failed to list product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>List a Product</h1>
          <p className={styles.subtitle}>Fill in the details to list your product on MarketPal</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>

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
                  <p>Click to upload image</p>
                  <p className={styles.uploadHint}>JPG, PNG, WebP — max 10MB</p>
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

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 3D Character Pack Vol.1"
              className={styles.input}
              required
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              className={styles.textarea}
              required
              rows={4}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 999"
                className={styles.input}
                required
                min="1"
                step="0.01"
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

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || uploading}
          >
            {uploading
              ? "Uploading image..."
              : loading
              ? "Listing product..."
              : "List Product"}
          </button>

        </form>
      </div>
    </div>
  );
}