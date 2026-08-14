"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/context/LanguageContext";
import { TruckIcon, ShieldCheckIcon, PackageIcon, PhoneIcon, GlobeIcon, BdFlagIcon, ArrowRightIcon } from "@/components/Icons";
import styles from "./TopBanner.module.css";

export default function TopBanner() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className={styles.bannerWrapper} id="top-announcement-system">
      {/* 1. Thin Top Utility Strip (Puma Header Style) */}
      <div className={styles.topUtilityStrip}>
        <div className={`container ${styles.utilityContainer}`}>
          <div className={styles.leftMessage}>
            <TruckIcon size={14} className={styles.accentIcon} />
            <span>FREE DELIVERY ACROSS BANGLADESH ON ORDERS OVER ৳5,000</span>
          </div>

          <div className={styles.rightLinks}>
            <Link href="/track-order" className={styles.utilityLink}>
              <PackageIcon size={13} />
              <span>Track Order</span>
            </Link>
            <span className={styles.pipe}>|</span>
            <a href="tel:+8801800909090" className={`${styles.utilityLink} ${styles.hideMobile}`}>
              <PhoneIcon size={13} />
              <span>Helpline: +880 1800-909090</span>
            </a>
            <span className={`${styles.pipe} ${styles.hideMobile}`}>|</span>
            {/* Language Switch */}
            <div className={styles.langSwitch}>
              <button
                className={`${styles.langBtn} ${language === "en" ? styles.langActive : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <span className={styles.langSlash}>/</span>
              <button
                className={`${styles.langBtn} ${language === "bn" ? styles.langActive : ""}`}
                onClick={() => setLanguage("bn")}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary High-Impact Sports Promo Bar (Puma Style Soft Blue / Emerald Bar) */}
      <div className={styles.secondaryPromoBar}>
        <div className="container">
          <Link href="/products" className={styles.promoLink}>
            <span className={styles.promoHighlight}>SPEND ৳3,000, GET ৳300 OFF WITH CODE &apos;KICKOFF&apos;</span>
            <span className={styles.promoSuffix}>SHOP NOW, SEE DETAILS</span>
            <ArrowRightIcon size={14} className={styles.promoArrow} />
          </Link>
        </div>
      </div>
    </div>
  );
}
