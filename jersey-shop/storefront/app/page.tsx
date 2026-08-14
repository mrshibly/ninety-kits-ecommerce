"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from "@/components/Icons";
import styles from "./page.module.css";

// 4-Column "NEW & FEATURED" (Puma Editorial Magazine Grid)
const NEW_AND_FEATURED = [
  {
    id: "epl",
    title: "PREMIER LEAGUE 2026",
    image: "/images/man_united_kit.jpg",
    href: "/products?league=Premier+League",
  },
  {
    id: "laliga",
    title: "LA LIGA CHAMPIONS",
    image: "/images/real_madrid_kit.jpg",
    href: "/products?league=La+Liga",
  },
  {
    id: "bd",
    title: "2026/27 BANGLADESH KIT",
    image: "/images/bangladesh_kit.jpg",
    href: "/products/bangladesh-national-team-jersey",
  },
  {
    id: "custom",
    title: "CUSTOM NAME & NUMBER",
    image: "/images/brazil_kit.jpg",
    href: "/products?category=customizable",
  },
];

export default function HomePage() {
  const { products, heroBanner } = useStoreData();
  const railRef = useRef<HTMLDivElement>(null);
  const trackBarRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthPct, setThumbWidthPct] = useState(25);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll metrics on scroll or resize
  const updateScrollMetrics = useCallback(() => {
    if (!railRef.current) return;
    const el = railRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setThumbWidthPct(100);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const progress = Math.min(Math.max(el.scrollLeft / maxScroll, 0), 1);
    const visibleRatio = Math.min(el.clientWidth / el.scrollWidth, 1);
    
    setScrollProgress(progress);
    setThumbWidthPct(Math.max(visibleRatio * 100, 15));
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScroll - 5);
  }, []);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener("resize", updateScrollMetrics);
    return () => window.removeEventListener("resize", updateScrollMetrics);
  }, [updateScrollMetrics, products]);

  const scrollRail = (direction: "left" | "right") => {
    if (railRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      railRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackBarRef.current || !railRef.current) return;
    const rect = trackBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.min(Math.max(clickX / rect.width, 0), 1);
    const maxScroll = railRef.current.scrollWidth - railRef.current.clientWidth;
    railRef.current.scrollTo({
      left: clickRatio * maxScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.homeWrapper}>
      {/* =========================================================
          1. FULL-BLEED EDITORIAL HERO BANNER (Puma Style Flagship)
         ========================================================= */}
      <section className={styles.heroBanner} id="hero-banner">
        <div className={styles.heroImageWrapper}>
          <Image
            src={heroBanner?.image || "/images/hero_banner.jpg"}
            alt="Authentic Football Match Experience"
            fill
            priority
            className={styles.heroImage}
            sizes="100vw"
            unoptimized={heroBanner?.image?.startsWith("data:")}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        {/* Text Overlay on Bottom-Left */}
        <div className={`container ${styles.heroTextContainer}`}>
          <div className={styles.heroBadgePill}>
            <span>{heroBanner?.badge || "NEW 2026/27 SEASON DROPS"}</span>
          </div>

          <h1 className={styles.heroMainTitle}>
            {heroBanner?.title || "NEVER NOT MATCH READY"}
          </h1>

          <p className={styles.heroSubtitle}>
            {heroBanner?.subtitle || "OFFICIAL 2026/27 CLUB & NATIONAL TEAM KITS"}
          </p>

          {/* Triple White Solid Action Buttons (Puma Style) */}
          <div className={styles.heroButtonRow}>
            <Link href="/products?category=club" className={styles.heroSolidBtn}>
              SHOP CLUB KITS
            </Link>
            <Link href="/products?category=national" className={styles.heroSolidBtn}>
              SHOP NATIONAL
            </Link>
            <Link href="/team-orders" className={styles.heroSolidBtn}>
              TEAM ORDERS
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          MATCHDAY LIVE MOTION MARQUEE TICKER
         ========================================================= */}
      <div className={styles.marqueeSection} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            <span>⚡ NEW 2026/27 SEASON KITS</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ CUSTOM NAME &amp; NUMBER PRINTING</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ FAST DELIVERY ALL OVER BANGLADESH</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ TEAM SQUAD DISCOUNTS UP TO 20% OFF</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ 7-DAY EASY SIZE EXCHANGE</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ CASH ON DELIVERY &amp; BKASH ACCEPTED</span>
            <span className={styles.marqueeDot}>•</span>
          </div>
          <div className={styles.marqueeContent}>
            <span>⚡ NEW 2026/27 SEASON KITS</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ CUSTOM NAME &amp; NUMBER PRINTING</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ FAST DELIVERY ALL OVER BANGLADESH</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ TEAM SQUAD DISCOUNTS UP TO 20% OFF</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ 7-DAY EASY SIZE EXCHANGE</span>
            <span className={styles.marqueeDot}>•</span>
            <span>⚡ CASH ON DELIVERY &amp; BKASH ACCEPTED</span>
            <span className={styles.marqueeDot}>•</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. HORIZONTAL QUICK PRODUCT SLIDER (Puma Product Rail Style)
         ========================================================= */}
      <section className={styles.productRailSection}>
        <div className="container">
          <div className={styles.railHeader}>
            <div>
              <h2 className={styles.railSectionTitle}>TOP MATCH KITS</h2>
              <p className={styles.railSectionSubtitle}>Most popular jerseys this week in Bangladesh</p>
            </div>

            <div className={styles.railArrows}>
              <button
                onClick={() => scrollRail("left")}
                className={`${styles.railArrowBtn} ${!canScrollLeft ? styles.railArrowDisabled : ""}`}
                aria-label="Scroll left"
                disabled={!canScrollLeft}
              >
                <ArrowLeftIcon size={18} />
              </button>
              <button
                onClick={() => scrollRail("right")}
                className={`${styles.railArrowBtn} ${!canScrollRight ? styles.railArrowDisabled : ""}`}
                aria-label="Scroll right"
                disabled={!canScrollRight}
              >
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>

          <div
            className={styles.railTrack}
            ref={railRef}
            onScroll={updateScrollMetrics}
          >
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className={styles.railCard}>
                <div className={styles.railImageContainer}>
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={320}
                    height={380}
                    className={styles.railProductImage}
                  />
                  {p.badge && <span className={styles.railBadge}>{p.badge}</span>}
                </div>

                <div className={styles.railMeta}>
                  <div className={styles.railMetaTop}>
                    <h3 className={styles.railProductName}>{p.name}</h3>
                    <span className={styles.railProductPrice}>৳{p.price.toLocaleString()}</span>
                  </div>
                  <span className={styles.railProductTeam}>{p.team} • {p.league}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Interactive Live Drag/Click Scrollbar Track */}
          <div
            className={styles.railScrollBar}
            ref={trackBarRef}
            onClick={handleTrackClick}
            role="scrollbar"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-orientation="horizontal"
          >
            <div
              className={styles.railScrollThumb}
              style={{
                width: `${thumbWidthPct}%`,
                left: `${scrollProgress * (100 - thumbWidthPct)}%`,
              }}
            ></div>
          </div>

          {/* Prominent Explore All Kits CTA */}
          <div className={styles.exploreAllRow}>
            <Link href="/products" className={styles.exploreAllBtn}>
              <span>EXPLORE ALL 2026/27 KITS ({products.length})</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. NEW & FEATURED (Puma 4-Column Magazine Grid)
         ========================================================= */}
      <section className={styles.editorialSection}>
        <div className="container">
          <h2 className={styles.editorialHeading}>NEW &amp; FEATURED</h2>

          <div className={styles.fourGrid}>
            {NEW_AND_FEATURED.map((item) => (
              <div key={item.id} className={styles.magazineCard}>
                <div className={styles.magazinePhotoWrap}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={styles.magazinePhoto}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <h3 className={styles.magazineTitle}>{item.title}</h3>
                <Link href={item.href} className={styles.shopNowBtn}>
                  SHOP NOW
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. OFFICIAL HEAT-PRESS PRINTING STUDIO SHOWCASE BANNER
         ========================================================= */}
      <section className={styles.customStudioSection}>
        <div className="container">
          <div className={styles.customStudioBanner}>
            <div className={styles.customStudioContent}>
              <div className={styles.customStudioBadge}>
                <SparklesIcon size={14} />
                <span>HEAT-PRESS PRINTING STUDIO</span>
              </div>
              <h2 className={styles.customStudioTitle}>
                PRINT ANY NAME &amp; SQUAD NUMBER
              </h2>
              <p className={styles.customStudioDesc}>
                Tournament-grade font heat-seal technology. Permanent vinyl lettering for Vinícius Jr 7, Messi 10, Bellingham 5, or customized with your own personal name &amp; number.
              </p>
              <div className={styles.customStudioActions}>
                <Link href="/products?category=customizable" className={styles.customPrimaryBtn}>
                  <span>CUSTOMIZE A JERSEY</span>
                  <ArrowRightIcon size={16} />
                </Link>
                <Link href="/team-orders" className={styles.customSecondaryBtn}>
                  TEAM SQUAD ORDERS (20% OFF)
                </Link>
              </div>
            </div>

            <div className={styles.customStudioVisual}>
              <div className={styles.jerseyBackCard}>
                <div className={styles.jerseyBackCanvas}>
                  <div className={styles.jerseyBackCollar}></div>
                  <span className={styles.previewPlayerName}>YOUR NAME</span>
                  <span className={styles.previewPlayerNumber}>10</span>
                </div>
                <span className={styles.jerseyBackCaption}>OFFICIAL TOURNAMENT VINYL PRINT</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
