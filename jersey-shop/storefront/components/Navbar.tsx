"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth } from "@/lib/context/AuthContext";
import { BoltIcon, SearchIcon, ShoppingBagIcon, HeartIcon, UserIcon, ShieldCheckIcon, CloseIcon } from "@/components/Icons";
import SearchModal from "@/components/SearchModal";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
        id="main-navigation"
      >
        <div className={`container ${styles.navContent}`}>
          {/* Left: Brand Logo (Puma style bold clean placement) */}
          <Link href="/" className={styles.logo} id="nav-logo" aria-label="NINETY KITS Home">
            <span className={styles.logoBadge}>
              <BoltIcon size={20} className={styles.logoIcon} />
            </span>
            <span className={styles.logoText}>
              NINETY <span className={styles.logoAccent}>KITS</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links (Bold Condensed Uppercase) */}
          <div className={styles.navLinks}>
            <Link
              href="/products"
              className={`${styles.navLink} ${pathname === "/products" ? styles.navLinkActive : ""}`}
            >
              ALL KITS
            </Link>
            <Link
              href="/products?league=Premier+League"
              className={`${styles.navLink} ${pathname.includes("Premier") ? styles.navLinkActive : ""}`}
            >
              PREMIER LEAGUE
            </Link>
            <Link
              href="/products?league=La+Liga"
              className={`${styles.navLink} ${pathname.includes("La+Liga") ? styles.navLinkActive : ""}`}
            >
              LA LIGA
            </Link>
            <Link
              href="/products?category=national"
              className={`${styles.navLink} ${pathname.includes("national") ? styles.navLinkActive : ""}`}
            >
              NATIONAL TEAMS
            </Link>
            <Link
              href="/products?category=customizable"
              className={`${styles.navLink} ${styles.navLinkHighlight} ${pathname.includes("customizable") ? styles.navLinkActive : ""}`}
            >
              CUSTOM PRINT
            </Link>
            <Link
              href="/team-orders"
              className={`${styles.navLink} ${pathname === "/team-orders" ? styles.navLinkActive : ""}`}
            >
              TEAM ORDERS
            </Link>
            <Link
              href="/products?filter=sale"
              className={`${styles.navLink} ${styles.navLinkSale}`}
            >
              SALE
            </Link>
          </div>

          {/* Right: Actions (Puma style search pill + wishlist + cart + account) */}
          <div className={styles.navActions}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={styles.searchPillBtn}
              aria-label="Search jerseys"
            >
              <SearchIcon size={16} />
              <span className={styles.searchText}>SEARCH</span>
            </button>

            <Link
              href="/wishlist"
              className={styles.iconBtn}
              aria-label="Wishlist"
            >
              <HeartIcon size={20} />
              {totalWishlist > 0 && <span className={styles.badgeCount}>{totalWishlist}</span>}
            </Link>

            <Link
              href={isAuthenticated ? (isAdmin ? "/admin" : "/account") : "/account/login"}
              className={`${styles.iconBtn} ${isAuthenticated ? styles.userLoggedInBtn : ""}`}
              aria-label="User Account"
            >
              {isAdmin ? <ShieldCheckIcon size={20} className={styles.adminNavIcon} /> : <UserIcon size={20} />}
              {isAuthenticated && <span className={styles.activeDot}></span>}
            </Link>

            <Link
              href="/cart"
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              aria-label="Shopping Cart"
            >
              <ShoppingBagIcon size={20} />
              {cartCount > 0 && <span className={styles.cartBadgeCount}>{cartCount}</span>}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : (
                <div className={styles.hamburger}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileLinks}>
              <Link href="/products" className={styles.mobileNavLink}>ALL KITS</Link>
              <Link href="/products?league=Premier+League" className={styles.mobileNavLink}>PREMIER LEAGUE</Link>
              <Link href="/products?league=La+Liga" className={styles.mobileNavLink}>LA LIGA</Link>
              <Link href="/products?category=national" className={styles.mobileNavLink}>NATIONAL TEAMS</Link>
              <Link href="/products?category=customizable" className={styles.mobileNavLink}>CUSTOM PRINT</Link>
              <Link href="/team-orders" className={styles.mobileNavLink}>TEAM ORDERS</Link>
              <Link href="/track-order" className={styles.mobileNavLink}>TRACK ORDER</Link>
              <Link href="/account" className={styles.mobileNavLink}>MY ACCOUNT</Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
