"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useStoreData } from "@/lib/context/StoreDataContext";
import ProductCard from "@/components/ProductCard";
import { HeartIcon, ArrowRightIcon, ShoppingBagIcon } from "@/components/Icons";
import styles from "./wishlist.module.css";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { products } = useStoreData();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>
            <HeartIcon size={16} />
            <span>SAVED ITEMS</span>
          </div>
          <h1 className={styles.title}>MY WISHLIST</h1>
          <p className={styles.subtitle}>
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "jersey saved" : "jerseys saved"} for later
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconCircle}>
              <HeartIcon size={36} />
            </div>
            <h2 className={styles.emptyTitle}>YOUR WISHLIST IS EMPTY</h2>
            <p className={styles.emptyDesc}>
              Save your favorite club &amp; country kits by clicking the heart icon on any jersey card.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              <span>EXPLORE ALL JERSEYS</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlistedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                bnName={p.bnName}
                slug={p.slug}
                price={p.price}
                originalPrice={p.originalPrice}
                currency={p.currency}
                image={p.images[0]}
                team={p.team}
                league={p.league}
                isCustomizable={p.isCustomizable}
                sizes={p.sizes}
                rating={p.rating}
                reviewCount={p.reviewCount}
                badge={p.badge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
