"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { UserIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";
import styles from "../account.module.css";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    login(email, "customer");
    router.push("/account");
  };

  const handleQuickDemoLogin = () => {
    login("customer@ninetykits.com", "customer");
    router.push("/account");
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIconBox}>
              <UserIcon size={24} />
            </div>
            <h1 className={styles.authTitle}>Customer Sign In</h1>
            <p className={styles.authSub}>Access your jersey orders, saved delivery addresses, and wishlist</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="login-email">Email Address *</label>
              <input
                type="email"
                id="login-email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label htmlFor="login-password">Password *</label>
                <a href="#forgot" className={styles.forgotLink}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                id="login-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
              <span>Sign In</span>
              <ArrowRightIcon size={16} />
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className={styles.demoLoginBox}>
            <span className={styles.demoLabel}>Instant Demo Access:</span>
            <button
              type="button"
              className={styles.demoBtn}
              onClick={handleQuickDemoLogin}
            >
              Sign In as Demo Customer (Tanvir Ahmed)
            </button>
          </div>

          <div className={styles.authFooter}>
            <span>Don&apos;t have an account?</span>
            <Link href="/account/register" className={styles.createLink}>
              Create Customer Account
            </Link>
          </div>

          {/* Admin Switch Link */}
          <div className={styles.adminSwitchRow}>
            <ShieldCheckIcon size={14} />
            <span>Store Staff?</span>
            <Link href="/admin/login" className={styles.adminLink}>
              Admin Portal Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
