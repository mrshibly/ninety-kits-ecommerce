"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/data/products";
import { useStoreData } from "@/lib/context/StoreDataContext";
import { SearchIcon, CloseIcon, ArrowRightIcon, TagIcon } from "@/components/Icons";
import { useLanguage } from "@/lib/context/LanguageContext";
import styles from "./SearchModal.module.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["Real Madrid", "Brazil", "Messi 10", "Barcelona", "Bangladesh", "Man United", "Custom Kit"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { products } = useStoreData();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: Product[] = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.team.toLowerCase().includes(query.toLowerCase()) ||
          p.league.toLowerCase().includes(query.toLowerCase()) ||
          (p.bnName && p.bnName.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search Bar Input */}
        <div className={styles.searchHeader}>
          <SearchIcon size={22} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Search Body */}
        <div className={styles.searchBody}>
          {query.trim() === "" ? (
            <div className={styles.suggestions}>
              <span className={styles.sectionLabel}>
                <TagIcon size={14} /> Popular Searches
              </span>
              <div className={styles.pillList}>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    className={styles.suggestionPill}
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.resultsList}>
              <span className={styles.sectionLabel}>
                Found {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
              <div className={styles.grid}>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={styles.resultItem}
                    onClick={onClose}
                  >
                    <div className={styles.resultImage}>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={60}
                        height={75}
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.resultDetails}>
                      <span className={styles.resultTeam}>{product.team} • {product.league}</span>
                      <h4 className={styles.resultName}>{product.name}</h4>
                      <div className={styles.resultPriceRow}>
                        <span className="price">৳{product.price.toLocaleString()}</span>
                        {product.isCustomizable && (
                          <span className={styles.customBadge}>Customizable</span>
                        )}
                      </div>
                    </div>
                    <ArrowRightIcon size={16} className={styles.arrow} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No jerseys matched &quot;{query}&quot;</p>
              <span className={styles.emptyHint}>Try searching for Real Madrid, Brazil, or Messi</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
