"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { UserIcon, ArrowRightIcon } from "@/components/Icons";
import styles from "../account.module.css";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    register(name, email, phone);
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
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authSub}>Register with NINETY KITS for 1-click checkout and tracked orders</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="reg-name">Full Name *</label>
              <input
                type="text"
                id="reg-name"
                required
                placeholder="Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="reg-email">Email Address *</label>
              <input
                type="email"
                id="reg-email"
                required
                placeholder="tanvir@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="reg-phone">Phone Number (11 digits) *</label>
              <input
                type="tel"
                id="reg-phone"
                required
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="reg-password">Password *</label>
              <input
                type="password"
                id="reg-password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
              <span>Create Account</span>
              <ArrowRightIcon size={16} />
            </button>
          </form>

          <div className={styles.authFooter}>
            <span>Already have an account?</span>
            <Link href="/account/login" className={styles.createLink}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
