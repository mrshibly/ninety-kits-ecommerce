"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { HeartIcon, SparklesIcon, StarIcon, ArrowRightIcon } from "@/components/Icons";
import styles from "./ProductCard.module.css";

export interface ProductCardProps {
  id: string;
  name: string;
  bnName?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  team?: string;
  league?: string;
  isCustomizable?: boolean;
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  bnName,
  slug,
  price,
  originalPrice,
  currency = "৳",
  image,
  team,
  league,
  isCustomizable,
  sizes = ["S", "M", "L", "XL", "XXL"],
  rating = 4.9,
  reviewCount = 50,
  badge,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { language, t } = useLanguage();
  const isWished = isInWishlist(id);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const displayName = language === "bn" && bnName ? bnName : name;

  return (
    <div className={styles.cardWrapper} id={`product-card-${slug}`}>
      <div className={styles.card}>
        {/* Top Badges & Wishlist */}
        <div className={styles.topActions}>
          <div className={styles.badgesCol}>
            {badge && <span className={styles.highlightBadge}>{badge}</span>}
            {discount > 0 && (
              <span className={styles.discountBadge}>
                -{discount}% {t.discountOff}
              </span>
            )}
            {isCustomizable && (
              <span className={styles.customBadge}>
                <SparklesIcon size={12} /> {t.customizableBadge}
              </span>
            )}
          </div>

          <button
            className={`${styles.wishlistBtn} ${isWished ? styles.wishedActive : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(id);
            }}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon size={18} fill={isWished ? "#FF3B5C" : "none"} />
          </button>
        </div>

        {/* Product Image Link */}
        <Link href={`/products/${slug}`} className={styles.imageLink}>
          <div className={styles.imageContainer}>
            <Image
              src={image}
              alt={name}
              width={400}
              height={500}
              className={styles.image}
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
            />
          </div>
        </Link>

        {/* Product Meta & Details */}
        <div className={styles.details}>
          <div className={styles.categoryRow}>
            {league && <span className={styles.leagueTag}>{league}</span>}
            <div className={styles.ratingBox}>
              <StarIcon size={13} filled={true} />
              <span className={styles.ratingVal}>{rating}</span>
              <span className={styles.reviewNum}>({reviewCount})</span>
            </div>
          </div>

          <Link href={`/products/${slug}`} className={styles.titleLink}>
            <h3 className={styles.title}>{displayName}</h3>
          </Link>

          {team && <p className={styles.teamName}>{team}</p>}

          {/* Size Pills */}
          {sizes && sizes.length > 0 && (
            <div className={styles.sizesRow}>
              {sizes.slice(0, 5).map((s) => (
                <span key={s} className={styles.sizeChip}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Price & Action */}
          <div className={styles.bottomRow}>
            <div className={styles.priceCol}>
              <div className={styles.priceMain}>
                <span className={styles.currency}>{currency}</span>
                <span className={styles.amount}>{price.toLocaleString()}</span>
              </div>
              {originalPrice && originalPrice > price && (
                <span className={styles.priceOriginal}>
                  {currency}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Link href={`/products/${slug}`} className={styles.actionBtn}>
              <span>{t.viewDetails}</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
