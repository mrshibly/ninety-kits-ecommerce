"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useStoreData } from "@/lib/context/StoreDataContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import {
  FilterIcon,
  SearchIcon,
  CloseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HeartIcon,
} from "@/components/Icons";
import styles from "./products.module.css";

const LEAGUES = ["All", "Premier League", "La Liga", "International", "Ligue 1", "Serie A"];
const CATEGORIES = ["all", "club", "national", "customizable", "wishlist"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function ProductsCatalogContent() {
  const { products: storeProducts } = useStoreData();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const initialCategory = filterParam === "wishlist" ? "wishlist" : (searchParams.get("category") || "all");
  const initialLeague = searchParams.get("league") || "All";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLeague, setSelectedLeague] = useState<string>(initialLeague);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useLanguage();
  const { wishlistIds } = useWishlist();

  const filteredProducts = useMemo(() => {
    let products = [...storeProducts];

    // Filter by wishlist
    if (selectedCategory === "wishlist") {
      products = products.filter((p) => wishlistIds.includes(p.id));
    } else if (selectedCategory === "customizable") {
      products = products.filter((p) => p.isCustomizable);
    } else if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by league
    if (selectedLeague !== "All") {
      products = products.filter(
        (p) => p.league.toLowerCase() === selectedLeague.toLowerCase()
      );
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        selectedSizes.some((size) => p.sizes.includes(size))
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.league.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [storeProducts, wishlistIds, selectedLeague, selectedCategory, selectedSizes, searchQuery, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedLeague("All");
    setSelectedCategory("all");
    setSelectedSizes([]);
    setSearchQuery("");
    setSortBy("featured");
  };

  const activeFilterCount =
    (selectedLeague !== "All" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    selectedSizes.length +
    (searchQuery ? 1 : 0);

  return (
    <div className={styles.page}>
      {/* Header Banner */}
      <section className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerTitleCol}>
              <span className={styles.headerBadge}>
                <ShieldCheckIcon size={14} /> Official Replica &amp; Match Editions
              </span>
              <h1 className={styles.title}>All Football Kits</h1>
              <p className={styles.subtitle}>
                Tournament-grade match and supporter jerseys with custom name &amp; number printing.
              </p>
            </div>

            {/* Catalog In-Line Search */}
            <div className={styles.searchBox}>
              <SearchIcon size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search jerseys or teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <section className={styles.content}>
        <div className="container">
          {/* Top Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                className={`${styles.filterToggle} ${showFilters ? styles.filterActive : ""}`}
                onClick={() => setShowFilters(!showFilters)}
                id="filter-toggle"
              >
                <FilterIcon size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className={styles.filterCount}>{activeFilterCount}</span>
                )}
              </button>

              <span className={styles.resultCount}>
                Showing <strong>{filteredProducts.length}</strong> kit{filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className={styles.toolbarRight}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
                id="sort-select"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          {activeFilterCount > 0 && (
            <div className={styles.activeChipsRow}>
              {selectedLeague !== "All" && (
                <span className={styles.filterChip}>
                  League: {selectedLeague}
                  <button onClick={() => setSelectedLeague("All")} aria-label="Remove league filter">
                    <CloseIcon size={12} />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className={styles.filterChip}>
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} aria-label="Remove category filter">
                    <CloseIcon size={12} />
                  </button>
                </span>
              )}
              {selectedSizes.map((sz) => (
                <span key={sz} className={styles.filterChip}>
                  Size: {sz}
                  <button onClick={() => toggleSize(sz)} aria-label={`Remove size ${sz} filter`}>
                    <CloseIcon size={12} />
                  </button>
                </span>
              ))}
              {searchQuery ? (
                <span className={styles.filterChip}>
                  Query: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} aria-label="Remove search query filter">
                    <CloseIcon size={12} />
                  </button>
                </span>
              ) : null}
              <button className={styles.clearAllBtn} onClick={clearFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Layout: Sidebar + Grid */}
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={`${styles.filters} ${showFilters ? styles.filtersOpen : ""}`}>
              {/* Category */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterTitle}>Type / Edition</h4>
                <div className={styles.filterOptionsList}>
                  <button
                    className={`${styles.filterBtn} ${selectedCategory === "all" ? styles.filterBtnActive : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Types
                  </button>
                  <button
                    className={`${styles.filterBtn} ${selectedCategory === "club" ? styles.filterBtnActive : ""}`}
                    onClick={() => setSelectedCategory("club")}
                  >
                    Club Teams
                  </button>
                  <button
                    className={`${styles.filterBtn} ${selectedCategory === "national" ? styles.filterBtnActive : ""}`}
                    onClick={() => setSelectedCategory("national")}
                  >
                    National Teams
                  </button>
                  <button
                    className={`${styles.filterBtn} ${selectedCategory === "customizable" ? styles.filterBtnActive : ""}`}
                    onClick={() => setSelectedCategory("customizable")}
                  >
                    <SparklesIcon size={14} /> Customizable Kits
                  </button>
                  <button
                    className={`${styles.filterBtn} ${selectedCategory === "wishlist" ? styles.filterBtnActive : ""}`}
                    onClick={() => setSelectedCategory("wishlist")}
                  >
                    <HeartIcon size={14} fill={selectedCategory === "wishlist" ? "#FF3B5C" : "none"} />
                    <span>My Wishlist ({wishlistIds.length})</span>
                  </button>
                </div>
              </div>

              {/* League */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterTitle}>League / Tournament</h4>
                <div className={styles.filterOptionsList}>
                  {LEAGUES.map((league) => (
                    <button
                      key={league}
                      className={`${styles.filterBtn} ${selectedLeague === league ? styles.filterBtnActive : ""}`}
                      onClick={() => setSelectedLeague(league)}
                    >
                      {league}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterTitle}>Available Sizes</h4>
                <div className={styles.sizeGrid}>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.sizeBtnActive : ""}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className={styles.gridWrapper}>
              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      bnName={product.bnName}
                      slug={product.slug}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      currency={product.currency}
                      image={product.images[0]}
                      team={product.team}
                      league={product.league}
                      isCustomizable={product.isCustomizable}
                      sizes={product.sizes}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      badge={product.badge}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconBox}>
                    <SearchIcon size={32} />
                  </div>
                  <h3>No jerseys matched your filter criteria</h3>
                  <p>Try resetting one of your filters or search terms.</p>
                  <button className="btn btn-secondary" onClick={clearFilters}>
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "80px 0" }}>Loading catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
