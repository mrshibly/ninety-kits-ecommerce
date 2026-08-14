"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { ShieldCheckIcon, ArrowRightIcon, BoltIcon } from "@/components/Icons";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your admin credentials.");
      return;
    }

    login(email, "admin");
    router.push("/admin");
  };

  const handleQuickDemoAdmin = () => {
    login("admin@ninetykits.com", "admin");
    router.push("/admin");
  };

  return (
    <div className={styles.adminLoginPage}>
      <div className="container">
        <div className={styles.adminAuthCard}>
          <div className={styles.adminHeader}>
            <div className={styles.adminLogoBox}>
              <BoltIcon size={24} />
            </div>
            <div className={styles.adminBadgeRow}>
              <ShieldCheckIcon size={16} />
              <span>NINETY KITS Admin Control Center</span>
            </div>
            <h1 className={styles.adminTitle}>Store Management Portal</h1>
            <p className={styles.adminSub}>
              Authorized personnel only. Access inventory, heat-press queue, COD verifications, and courier dispatching.
            </p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.adminForm}>
            <div className={styles.field}>
              <label htmlFor="admin-email">Admin Email ID *</label>
              <input
                type="email"
                id="admin-email"
                required
                placeholder="admin@ninetykits.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="admin-password">Master Security Key *</label>
              <input
                type="password"
                id="admin-password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.adminSubmitBtn}`}>
              <ShieldCheckIcon size={18} />
              <span>Access Admin Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className={styles.demoAdminBox}>
            <span className={styles.demoAdminLabel}>Instant Staff Demo:</span>
            <button
              type="button"
              className={styles.demoAdminBtn}
              onClick={handleQuickDemoAdmin}
            >
              Sign In as Operations Admin (Full Permissions)
            </button>
          </div>

          <div className={styles.adminFooter}>
            <Link href="/" className={styles.backLink}>
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
