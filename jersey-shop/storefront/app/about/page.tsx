"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BoltIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ChevronDownIcon,
  BadgeCheckIcon,
} from "@/components/Icons";
import styles from "./about.module.css";

const FAQS = [
  {
    q: "How does the custom name and number printing work?",
    a: "We use tournament-grade polyurethane vinyl heat-applied at 160°C under high pneumatic pressure. This creates a permanent, flexible bond with the jersey fabric that won't crack, peel, or fade during machine washing.",
  },
  {
    q: "What is the difference between Fan Version and Player Match Issue?",
    a: "Fan Version jerseys offer a comfortable, regular athletic cut suitable for everyday supporter wear. Player Match Issue jerseys feature the exact tapered slim fit, perforated heat-transferred badges, and lightweight breathable mesh worn on-pitch by professional athletes.",
  },
  {
    q: "How fast is delivery across Bangladesh?",
    a: "Orders inside Dhaka metropolitan area are delivered in 1-2 business days (৳60). Orders across all other 63 districts are delivered in 3-4 business days (৳120) via our delivery partners Pathao Express and Steadfast Courier.",
  },
  {
    q: "What is your replacement and size exchange policy?",
    a: "We offer a 7-day hassle-free size exchange policy. If your jersey doesn't fit comfortably, contact our support team and we will coordinate an exchange across any district in Bangladesh.",
  },
  {
    q: "Do you accept team orders and bulk custom printing?",
    a: "Yes! We specialize in team, academy, corporate, and university tournament orders. Bulk pricing begins at 10+ jerseys and includes custom club crests, sponsor logos, and player rosters.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      {/* Brand Hero */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.brandBadge}>
              <BoltIcon size={18} />
              <span>About NINETY KITS</span>
            </div>
            <h1 className={styles.title}>Crafted for the Pitch. Built for the Passionate.</h1>
            <p className={styles.desc}>
              NINETY KITS was founded with a single mission: to deliver authentic, high-specification sports jerseys with bespoke tournament-grade printing to athletes and supporters across Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Workshop & Quality Grid */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.iconCircle}>
                <SparklesIcon size={24} />
              </div>
              <h3>Pneumatic Heat-Press Studio</h3>
              <p>
                Our specialized printing facility in Uttara, Dhaka utilizes official league typography sets, ensuring sharp contrast and long-lasting durability.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.iconCircle}>
                <ShieldCheckIcon size={24} />
              </div>
              <h3>100% Quality Inspected</h3>
              <p>
                Every jersey passes individual stitching, alignment, and fabric weight inspection before being packed into secure courier bags.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.iconCircle}>
                <TruckIcon size={24} />
              </div>
              <h3>64-District Logistics Network</h3>
              <p>
                Integrated with Pathao Express and Steadfast logistics for tracked door-to-door delivery and verified Cash on Delivery anywhere in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Contact Box */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactCard}>
            <div className={styles.contactDetails}>
              <span className={styles.contactLabel}>Dhaka Operations &amp; Workshop</span>
              <h2>Visit Our Fulfillment Center</h2>
              <p>
                Have questions about custom team kits or need to view fabric swatches in person? Our support team is ready to assist you.
              </p>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <MapPinIcon size={18} className={styles.itemIcon} />
                  <span>House 12, Road 5, Sector 11, Uttara, Dhaka-1230</span>
                </div>
                <div className={styles.contactItem}>
                  <PhoneIcon size={18} className={styles.itemIcon} />
                  <span>Hotline: +880 1800-NINETY (909090) • Mon-Sat (10am - 8pm)</span>
                </div>
                <div className={styles.contactItem}>
                  <MailIcon size={18} className={styles.itemIcon} />
                  <span>support@ninetykits.com • teamorders@ninetykits.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqHeader}>
            <span className="badge">Knowledge Base</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`${styles.faqItem} ${openFaq === idx ? styles.faqOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDownIcon
                    size={18}
                    className={styles.chevron}
                    style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {openFaq === idx && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
