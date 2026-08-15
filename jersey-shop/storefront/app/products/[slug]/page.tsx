"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStoreData } from "@/lib/context/StoreDataContext";
import { useAuth } from "@/lib/context/AuthContext";
import {
  TruckIcon,
  CreditCardIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  StarIcon,
  BadgeCheckIcon,
  ChevronRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@/components/Icons";
import styles from "./product-detail.module.css";
import AddToCartSection from "./AddToCartSection";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { getProductBySlug, addProductReview } = useStoreData();
  const { user } = useAuth();
  const product = getProductBySlug(slug);

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [comment, setComment] = useState("");
  const [reviewNotice, setReviewNotice] = useState(false);

  useEffect(() => {
    if (user?.name && !authorName) {
      setAuthorName(user.name);
    }
  }, [user, authorName]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addProductReview(product?.id || slug, {
      author: authorName.trim() || user?.name || "Verified Customer",
      city: city.trim() || "Dhaka",
      rating: newRating,
      comment: comment.trim(),
    });

    setComment("");
    setIsWritingReview(false);
    setReviewNotice(true);
    setTimeout(() => setReviewNotice(false), 4000);
  };

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

            {/* Interactive Customer Reviews & Verified Rating System */}
            <div className={styles.reviewsCard} id="customer-reviews-section">
              <div className={styles.reviewsHeaderRow}>
                <div>
                  <div className={styles.reviewsTitleGroup}>
                    <h4 className={styles.reviewsHeaderTitle}>
                      Verified Supporter Reviews ({product.reviews?.length || 0})
                    </h4>
                    <span className={styles.reviewsScoreBadge}>
                      ⭐ {product.rating || 5.0} / 5.0
                    </span>
                  </div>
                  <p className={styles.reviewsSubText}>
                    Authentic feedback from verified jersey purchasers across Bangladesh.
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.writeReviewToggleBtn}
                  onClick={() => setIsWritingReview(!isWritingReview)}
                >
                  <PlusIcon size={14} />
                  <span>{isWritingReview ? "Close Form" : "Write a Review"}</span>
                </button>
              </div>

              {/* Review Published Success Alert */}
              {reviewNotice && (
                <div className={styles.reviewSuccessNotice}>
                  <CheckCircleIcon size={16} />
                  <span>Thank you! Your verified review has been published.</span>
                </div>
              )}

              {/* Interactive Write Review Form */}
              {isWritingReview && (
                <form onSubmit={handleReviewSubmit} className={styles.writeReviewForm}>
                  <h5 className={styles.formSectionTitle}>Share Your Match Grade Experience</h5>
                  
                  {/* Star Rating Picker */}
                  <div className={styles.ratingPickerGroup}>
                    <label className={styles.fieldLabel}>YOUR RATING *</label>
                    <div className={styles.starsPickerRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={styles.starPickerBtn}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(star)}
                          aria-label={`${star} Stars`}
                        >
                          <StarIcon
                            size={22}
                            filled={star <= (hoverRating || newRating)}
                            className={star <= (hoverRating || newRating) ? styles.starFilled : styles.starEmpty}
                          />
                        </button>
                      ))}
                      <span className={styles.ratingDescText}>
                        {(hoverRating || newRating) === 5 && "5 Stars — Master Grade Excellence"}
                        {(hoverRating || newRating) === 4 && "4 Stars — Great Match Fit"}
                        {(hoverRating || newRating) === 3 && "3 Stars — Good Quality"}
                        {(hoverRating || newRating) === 2 && "2 Stars — Fair"}
                        {(hoverRating || newRating) === 1 && "1 Star — Needs Improvement"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.reviewFieldsRow2}>
                    <div className={styles.fieldItem}>
                      <label htmlFor="rev-author" className={styles.fieldLabel}>YOUR NAME *</label>
                      <input
                        type="text"
                        id="rev-author"
                        required
                        placeholder="e.g. Shakib Al Hasan"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className={styles.reviewInput}
                      />
                    </div>

                    <div className={styles.fieldItem}>
                      <label htmlFor="rev-city" className={styles.fieldLabel}>CITY / DISTRICT *</label>
                      <input
                        type="text"
                        id="rev-city"
                        required
                        placeholder="e.g. Dhaka / Chattogram"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={styles.reviewInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldItem}>
                    <label htmlFor="rev-comment" className={styles.fieldLabel}>YOUR REVIEW &amp; FIT FEEDBACK *</label>
                    <textarea
                      id="rev-comment"
                      required
                      rows={3}
                      placeholder="Share details about the fabric breathability, sizing fit, and heat-press custom print quality..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={styles.reviewTextarea}
                    />
                  </div>

                  <div className={styles.reviewFormFooter}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsWritingReview(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <CheckCircleIcon size={16} />
                      <span>Submit Verified Review</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className={styles.reviewsList}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className={styles.singleReview}>
                      <div className={styles.reviewHead}>
                        <div className={styles.reviewerMeta}>
                          <div className={styles.reviewerAvatar}>
                            {rev.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.reviewerNameRow}>
                              <strong>{rev.author}</strong>
                              <span className={styles.verifiedBadge}>
                                <BadgeCheckIcon size={13} />
                                <span>Verified Buyer</span>
                              </span>
                            </div>
                            <span className={styles.reviewCity}>{rev.city} • {rev.date}</span>
                          </div>
                        </div>

                        <div className={styles.stars}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                              key={s}
                              size={13}
                              filled={s <= rev.rating}
                              className={s <= rev.rating ? styles.starFilled : styles.starEmpty}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyReviews}>
                    <p>No customer reviews yet. Be the first verified supporter to review this official jersey!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
