"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  BoltIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YoutubeIcon,
  BkashLogo,
  NagadLogo,
  RocketLogo,
  VisaLogo,
  MastercardLogo,
  CodLogo,
  BdFlagIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/components/Icons";
import styles from "./Footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useStoreData();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const helpline = settings.supportHelpline || "+880 1800-909090";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className={styles.footer} id="site-footer">
      <div className="container">
        {/* Sleek Minimalist 4-Column Grid */}
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoBadge}>
                <BoltIcon size={16} />
              </span>
              <span className={styles.logoText}>NINETY KITS</span>
            </Link>
            <p className={styles.brandDesc}>
              Official tournament and supporter matchwear with custom name printing across Bangladesh.
            </p>
            <div className={styles.socialRow}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
                <FacebookIcon size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Support */}
          <div className={styles.navCol}>
            <h4 className={styles.heading}>SUPPORT</h4>
            <Link href="/track-order" className={styles.link}>Track Order</Link>
            <Link href="/about" className={styles.link}>Delivery &amp; Shipping</Link>
            <Link href="/about" className={styles.link}>7-Day Size Exchange</Link>
            <Link href="/team-orders" className={styles.link}>Team Orders</Link>
            <a href={`tel:${helpline.replace(/\s+/g, "")}`} className={styles.link}>Helpline: {helpline}</a>
          </div>

          {/* Column 3: About */}
          <div className={styles.navCol}>
            <h4 className={styles.heading}>ABOUT</h4>
            <Link href="/about" className={styles.link}>About NINETY KITS</Link>
            <Link href="/products?category=customizable" className={styles.link}>Custom Print Studio</Link>
            <Link href="/about" className={styles.link}>Dhaka Workshop</Link>
            <Link href="/about" className={styles.link}>Privacy &amp; Terms</Link>
          </div>

          {/* Column 4: Newsletter */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.heading}>NEWSLETTER</h4>
            <p className={styles.newsletterText}>
              Get ৳200 off your first kit and early access to drops.
            </p>
            {subscribed ? (
              <div className={styles.successBadge}>
                <CheckIcon size={14} />
                <span>Subscribed! Use code KICKOFF.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.inlineForm}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
                <button type="submit" className={styles.submitBtn} aria-label="Subscribe">
                  <ArrowRightIcon size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Country + Copyright + Payment */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <div className={styles.countryPill}>
              <BdFlagIcon size={14} />
              <span>BANGLADESH</span>
            </div>
            <span className={styles.copyright}>
              &copy; {new Date().getFullYear()} NINETY KITS. ALL RIGHTS RESERVED.
            </span>
          </div>

          <div className={styles.payments}>
            <BkashLogo height={18} />
            <NagadLogo height={18} />
            <RocketLogo height={18} />
            <VisaLogo height={18} />
            <MastercardLogo height={18} />
            <CodLogo height={18} />
          </div>
        </div>
      </div>
    </footer>
  );
}
