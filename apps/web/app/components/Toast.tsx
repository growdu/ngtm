"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ message, type = "success" }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Toast auto-dismisses via parent state
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
