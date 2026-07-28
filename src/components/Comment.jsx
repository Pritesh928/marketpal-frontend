import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { commentAPI } from "../service/api";
import { useAuth } from "../context/AuthContext";
import styles from "./css/Comment.module.css";

export default function Comment({ productId }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentAPI.getComments(productId);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await commentAPI.addComment(productId, { content });
      setComments([response.data, ...comments]);
      setContent("");
    } catch (err) {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError("Failed to delete comment.");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputRow}>
            <div className={styles.avatar}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              className={styles.textarea}
              rows={2}
              maxLength={500}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formFooter}>
            <span className={styles.charCount}>
              {content.length}/500
            </span>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || !content.trim()}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          <p>
            <button
              onClick={() => navigate("/login")}
              className={styles.loginLink}
            >
              Login
            </button>
            {" "}to leave a comment
          </p>
        </div>
      )}

      <div className={styles.divider} />

      {loading && (
        <p className={styles.loadingText}>Loading comments...</p>
      )}

      {!loading && comments.length === 0 && (
        <p className={styles.emptyText}>
          No comments yet. Be the first to comment!
        </p>
      )}

      <div className={styles.list}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentAvatar}>
              {comment.username?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <span className={styles.commentUsername}>
                  @{comment.username}
                </span>
                <span className={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>

            {isLoggedIn && user?.username === comment.username && (
              <button
                onClick={() => handleDelete(comment.id)}
                className={styles.deleteBtn}
                title="Delete comment"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}