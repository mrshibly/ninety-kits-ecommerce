"use client";

import { useState } from "react";
import Link from "next/link";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  PackageIcon,
  SearchIcon,
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@/components/Icons";
import styles from "./track.module.css";

interface TrackingResult {
  orderId: string;
  recipient: string;
  phone: string;
  address: string;
  items: { name: string; size: string; customName?: string; customNumber?: string }[];
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  currentStep: number;
  timeline: { title: string; time: string; desc: string; done: boolean }[];
}

export default function TrackOrderPage() {
  const { getOrderById } = useStoreData();
  const [queryOrderId, setQueryOrderId] = useState("");
  const [queryPhone, setQueryPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryOrderId.trim()) return;

    setLoading(true);
    setSearched(true);

    setTimeout(() => {
      setLoading(false);
      const found = getOrderById(queryOrderId);

      if (found) {
        const stepMap = {
          "Pending COD": 1,
          "Printing Queue": 2,
          "Quality Checked": 3,
          "Dispatched": 4,
          "Delivered": 5,
        };
        const currentStep = stepMap[found.status] || 2;

        setResult({
          orderId: found.id,
          recipient: found.customerName,
          phone: found.phone,
          address: `${found.address}, ${found.district}`,
          items:
            found.itemDetails && found.itemDetails.length > 0
              ? found.itemDetails
              : [
                  {
                    name: found.items,
                    size: "Standard",
                    customName: found.customDetail?.split("|")[0]?.replace("Name:", "").trim(),
                    customNumber: found.customDetail?.split("|")[1]?.replace("No:", "").trim(),
                  },
                ],
          courier: found.courier || "Pathao Express Courier",
          trackingNumber: found.trackingNumber || `PTH-${found.id.replace("NK-", "")}-BD`,
          estimatedDelivery: found.status === "Delivered" ? "Delivered to recipient" : "Within 24-48 Hours",
          currentStep,
          timeline: [
            {
              title: "Order Received & Confirmed",
              time: found.date,
              desc: `Payment via ${found.paymentMethod}. Invoice created.`,
              done: currentStep >= 1,
            },
            {
              title: "Name & Number Printing",
              time: currentStep >= 2 ? "Printing in progress" : "Upcoming",
              desc: "Applying player name and number on the jersey.",
              done: currentStep >= 2,
            },
            {
              title: "Quality Check & Packing",
              time: currentStep >= 3 ? "Ready for dispatch" : "Upcoming",
              desc: "Inspection of fabric stitching and safe packaging.",
              done: currentStep >= 3,
            },
            {
              title: "Handed Over to Courier",
              time: currentStep >= 4 ? "On the way" : "Upcoming",
              desc: `${found.courier} tracking ID: ${found.trackingNumber || "Assigned"}`,
              done: currentStep >= 4,
            },
            {
              title: "Delivered to Your Doorstep",
              time: currentStep >= 5 ? "Delivered" : "Expected soon",
              desc: "Package delivered safely to recipient.",
              done: currentStep >= 5,
            },
          ],
        });
      } else {
        setResult(null);
      }
    }, 300);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <PackageIcon size={24} />
          </div>
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.subtitle}>
            Enter your <strong>Order ID</strong> (e.g. NK-892410) to see your printing and delivery status.
          </p>
        </div>

        {/* Tracking Lookup Box */}
        <div className={styles.lookupCard}>
          <form onSubmit={handleTrack} className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="track-order-id">Order ID *</label>
              <input
                type="text"
                id="track-order-id"
                required
                placeholder="e.g. NK-892410"
                value={queryOrderId}
                onChange={(e) => setQueryOrderId(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="track-phone">Phone Number</label>
              <input
                type="tel"
                id="track-phone"
                placeholder="01XXXXXXXXX"
                value={queryPhone}
                onChange={(e) => setQueryPhone(e.target.value)}
                className={styles.input}
              />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.trackBtn}`} disabled={loading}>
              <SearchIcon size={18} />
              <span>{loading ? "Checking..." : "Track Order"}</span>
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingCard}>
            <div className={styles.spinner}></div>
            <p>Querying dynamic warehouse and courier database...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searched && result && (
          <div className={styles.resultContainer}>
            {/* Status Summary Top Bar */}
            <div className={styles.summaryBar}>
              <div className={styles.summaryCol}>
                <span className={styles.summaryLabel}>Order ID</span>
                <strong className={styles.summaryValue}>{result.orderId}</strong>
              </div>
              <div className={styles.summaryCol}>
                <span className={styles.summaryLabel}>Recipient</span>
                <strong className={styles.summaryValue}>{result.recipient}</strong>
              </div>
              <div className={styles.summaryCol}>
                <span className={styles.summaryLabel}>Courier Partner</span>
                <strong className={styles.summaryValue}>{result.courier}</strong>
              </div>
              <div className={styles.summaryCol}>
                <span className={styles.summaryLabel}>Tracking Number</span>
                <strong className={styles.summaryValue} style={{ color: "var(--color-emerald-dark)", fontFamily: "monospace" }}>
                  {result.trackingNumber}
                </strong>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className={styles.stepperCard}>
              <h3 className={styles.cardHeading}>Production &amp; Dispatch Timeline</h3>
              <div className={styles.stepperWrapper}>
                {result.timeline.map((step, idx) => (
                  <div key={idx} className={`${styles.stepItem} ${step.done ? styles.stepDone : ""}`}>
                    <div className={styles.stepMarkerBox}>
                      <div className={styles.stepCircle}>
                        {step.done ? <CheckCircleIcon size={16} /> : <span>{idx + 1}</span>}
                      </div>
                      {idx < result.timeline.length - 1 && <div className={styles.stepLine}></div>}
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepHeaderRow}>
                        <strong className={styles.stepTitle}>{step.title}</strong>
                        <span className={styles.stepTime}>{step.time}</span>
                      </div>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items & Shipping Address Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.itemsCard}>
                <h4 className={styles.cardSubheading}>Ordered Custom Matchwear</h4>
                <div className={styles.itemsList}>
                  {result.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div>
                        <strong>{item.name}</strong>
                        <div className={styles.itemMeta}>
                          <span>Size: {item.size}</span>
                          {item.customName && (
                            <span className={styles.customBadge}>
                              <SparklesIcon size={12} /> {item.customName} #{item.customNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.shippingCard}>
                <h4 className={styles.cardSubheading}>Delivery Destination</h4>
                <div className={styles.addressInfo}>
                  <div className={styles.addressRow}>
                    <MapPinIcon size={18} />
                    <span>{result.address}</span>
                  </div>
                  <div className={styles.addressRow}>
                    <PhoneIcon size={18} />
                    <span>{result.phone}</span>
                  </div>
                </div>
                <div className={styles.supportNote}>
                  <ShieldCheckIcon size={16} />
                  <span>Need urgent delivery support? Call WhatsApp Hotline <strong>+880 1700-000000</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!loading && searched && !result && (
          <div className={styles.notFoundCard}>
            <PackageIcon size={48} />
            <h3>No Order Found for &quot;{queryOrderId}&quot;</h3>
            <p>
              Please double check the Order ID in your SMS or email confirmation. If you just placed the order, please allow a couple minutes to synchronize with the courier database.
            </p>
            <Link href="/" className="btn btn-secondary">
              <span>Return to Storefront</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
