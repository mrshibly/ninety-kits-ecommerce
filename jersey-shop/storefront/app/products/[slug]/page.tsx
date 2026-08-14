"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  TruckIcon,
  CreditCardIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  StarIcon,
  BadgeCheckIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@/components/Icons";
import styles from "./product-detail.module.css";
import AddToCartSection from "./AddToCartSection";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { getProductBySlug } = useStoreData();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Product Not Found</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "8px", marginBottom: "24px" }}>
            The requested jersey kit could not be located in the dynamic catalog.
          </p>
          <Link href="/products" className="btn btn-primary">
            Explore All Available Kits →
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRightIcon size={12} className={styles.breadcrumbSep} />
          <Link href="/products">All Kits</Link>
          <ChevronRightIcon size={12} className={styles.breadcrumbSep} />
          <Link href={`/products?league=${encodeURIComponent(product.league)}`}>
            {product.league}
          </Link>
          <ChevronRightIcon size={12} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Two Column Layout */}
        <div className={styles.layout}>
          {/* Left Column: Product Visuals */}
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {discount > 0 && (
                <span className={styles.discountTag}>-{discount}% OFF</span>
              )}
              {product.badge && (
                <span className={styles.editionTag}>{product.badge}</span>
              )}
              <Image
                src={product.images[0] || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                width={600}
                height={750}
                className={styles.image}
                priority
              />
            </div>

            {/* Quality Checklist Card */}
            <div className={styles.qualityChecklist}>
              <div className={styles.checklistTitle}>
                <ShieldCheckIcon size={16} />
                <span>Jersey Features &amp; Quality</span>
              </div>
              <div className={styles.checkGrid}>
                <div className={styles.checkItem}>
                  <BadgeCheckIcon size={14} className={styles.checkIcon} />
                  <span>Stitched 3D Club Crest</span>
                </div>
                <div className={styles.checkItem}>
                  <BadgeCheckIcon size={14} className={styles.checkIcon} />
                  <span>Breathable Comfort Mesh</span>
                </div>
                <div className={styles.checkItem}>
                  <BadgeCheckIcon size={14} className={styles.checkIcon} />
                  <span>Official Tournament Badges</span>
                </div>
                <div className={styles.checkItem}>
                  <BadgeCheckIcon size={14} className={styles.checkIcon} />
                  <span>Machine Wash Safe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Section */}
          <div className={styles.infoSection}>
            {/* Top Badges */}
            <div className={styles.metaRow}>
              <span className="badge">{product.league}</span>
              <span className={styles.editionBadge}>{product.edition}</span>
              {product.isCustomizable && (
                <span className="badge">
                  <SparklesIcon size={12} /> Custom Name Print
                </span>
              )}
            </div>

            {/* Title & Ratings */}
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                <StarIcon size={16} filled={true} />
                <StarIcon size={16} filled={true} />
                <StarIcon size={16} filled={true} />
                <StarIcon size={16} filled={true} />
                <StarIcon size={16} filled={true} />
              </div>
              <span className={styles.ratingScore}>{product.rating}</span>
              <span className={styles.reviewLink}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price Block */}
            <div className={styles.priceBlock}>
              <span className={styles.mainPrice}>
                <span className={styles.currencySymbol}>{product.currency || "৳"}</span>
                {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={styles.originalPrice}>
                  {product.currency || "৳"}{product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className={styles.saveBadge}>Save ৳{(product.originalPrice! - product.price).toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            <p className={styles.description}>{product.description}</p>

            {/* Interactive Add to Cart & Customizer */}
            <AddToCartSection
              productId={product.id}
              sizes={product.sizes}
              isCustomizable={product.isCustomizable}
              productName={product.name}
              productSlug={product.slug}
              productPrice={product.price}
              productCurrency={product.currency || "৳"}
              productImage={product.images[0] || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80"}
              productTeam={product.team}
              stockCount={product.stockCount}
            />

            {/* Fast Delivery & Trust Box */}
            <div className={styles.deliveryBox}>
              <div className={styles.deliveryItem}>
                <TruckIcon size={20} className={styles.deliveryIcon} />
                <div>
                  <strong>Fast Delivery</strong>
                  <p>Inside Dhaka: ৳60 (1-2 days) • Outside Dhaka: ৳120 (3-4 days via Pathao / Steadfast)</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <CreditCardIcon size={20} className={styles.deliveryIcon} />
                <div>
                  <strong>Easy Payment Methods</strong>
                  <p>bKash, Nagad, Rocket, Visa / Mastercard, or Cash on Delivery</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <RefreshCcwIcon size={20} className={styles.deliveryIcon} />
                <div>
                  <strong>7-Day Easy Size Exchange</strong>
                  <p>Need a different size? We will exchange it quickly</p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            {product.specs && (
              <div className={styles.specsCard}>
                <h4 className={styles.specsTitle}>Jersey Details</h4>
                <div className={styles.specsGrid}>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>Fabric</span>
                    <span className={styles.specVal}>{product.specs.fabric}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>Fit</span>
                    <span className={styles.specVal}>{product.specs.fit}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>Technology</span>
                    <span className={styles.specVal}>{product.specs.technology}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>Washing Care</span>
                    <span className={styles.specVal}>{product.specs.care}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>Grade</span>
                    <span className={styles.specVal}>{product.specs.origin}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className={styles.reviewsCard}>
                <h4 className={styles.reviewsHeaderTitle}>
                  Customer Reviews ({product.reviews.length})
                </h4>
                <div className={styles.reviewsList}>
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className={styles.singleReview}>
                      <div className={styles.reviewHead}>
                        <div>
                          <strong>{rev.author}</strong>
                          <span className={styles.reviewCity}> • {rev.city}</span>
                        </div>
                        <div className={styles.stars}>
                          <StarIcon size={13} filled={true} />
                          <StarIcon size={13} filled={true} />
                          <StarIcon size={13} filled={true} />
                          <StarIcon size={13} filled={true} />
                          <StarIcon size={13} filled={true} />
                        </div>
                      </div>
                      <p className={styles.reviewComment}>&quot;{rev.comment}&quot;</p>
                      <span className={styles.reviewDate}>{rev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
