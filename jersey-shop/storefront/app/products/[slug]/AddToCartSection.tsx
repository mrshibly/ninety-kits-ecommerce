"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import SizeGuideModal from "@/components/SizeGuideModal";
import {
  SparklesIcon,
  RulerIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  BadgeCheckIcon,
} from "@/components/Icons";
import styles from "./product-detail.module.css";

interface AddToCartSectionProps {
  productId: string;
  sizes: string[];
  isCustomizable: boolean;
  productName: string;
  productSlug: string;
  productPrice: number;
  productCurrency: string;
  productImage: string;
  productTeam: string;
  stockCount?: number;
}

export default function AddToCartSection({
  productId,
  sizes,
  isCustomizable,
  productName,
  productSlug,
  productPrice,
  productCurrency,
  productImage,
  productTeam,
  stockCount = 35,
}: AddToCartSectionProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedEdition, setSelectedEdition] = useState<"fan" | "player">("fan");
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [fontStyle, setFontStyle] = useState<"league" | "classic">("league");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Player edition costs +৳300 extra
  const editionSurge = selectedEdition === "player" ? 300 : 0;
  // Customization costs +৳200
  const customSurge = customName || customNumber ? 200 : 0;
  const unitPrice = productPrice + editionSurge + customSurge;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addItem({
      productId,
      name: `${productName} (${selectedEdition === "player" ? "Player Match Edition" : "Fan Edition"})`,
      slug: productSlug,
      price: unitPrice,
      currency: productCurrency,
      image: productImage,
      size: selectedSize,
      quantity,
      customName: customName ? customName.toUpperCase() : undefined,
      customNumber: customNumber || undefined,
      team: productTeam,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  return (
    <>
      <div className={styles.addToCartSection}>
        {/* Edition Selector: Fan vs Player Issue */}
        <div className={styles.editionSection}>
          <span className={styles.sectionLabel}>Select Kit Edition:</span>
          <div className={styles.editionGrid}>
            <button
              className={`${styles.editionCard} ${selectedEdition === "fan" ? styles.editionActive : ""}`}
              onClick={() => setSelectedEdition("fan")}
              type="button"
            >
              <div className={styles.editionRadio}>
                {selectedEdition === "fan" && <div className={styles.radioDot} />}
              </div>
              <div className={styles.editionText}>
                <strong>Fan Version</strong>
                <span>Standard regular athletic cut</span>
              </div>
              <span className={styles.editionPriceTag}>Standard</span>
            </button>

            <button
              className={`${styles.editionCard} ${selectedEdition === "player" ? styles.editionActive : ""}`}
              onClick={() => setSelectedEdition("player")}
              type="button"
            >
              <div className={styles.editionRadio}>
                {selectedEdition === "player" && <div className={styles.radioDot} />}
              </div>
              <div className={styles.editionText}>
                <strong>Player Match Issue</strong>
                <span>Tapered fit • Heat.RDY vented</span>
              </div>
              <span className={styles.editionPriceTag}>+৳300</span>
            </button>
          </div>
        </div>

        {/* Size Selector */}
        <div className={styles.sizeSection}>
          <div className={styles.sizeHeader}>
            <span className={styles.sectionLabel}>{t.selectSize}:</span>
            <button
              type="button"
              className={styles.sizeGuideBtn}
              onClick={() => setIsSizeGuideOpen(true)}
            >
              <RulerIcon size={14} />
              <span>{t.sizeGuide}</span>
            </button>
          </div>
          <div className={styles.sizeGrid}>
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`${styles.sizeOption} ${selectedSize === size ? styles.sizeOptionActive : ""}`}
                onClick={() => setSelectedSize(size)}
                id={`size-${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Live Custom Name & Squad Number Box */}
        {isCustomizable && (
          <div className={styles.customSection}>
            <button
              type="button"
              className={`${styles.customToggle} ${showCustomizer ? styles.customToggleActive : ""}`}
              onClick={() => setShowCustomizer(!showCustomizer)}
              id="customize-toggle"
            >
              <div className={styles.customToggleTitle}>
                <SparklesIcon size={16} className={styles.customSparkle} />
                <span>{t.addNameNumber}</span>
              </div>
              <span className={styles.customToggleState}>
                {showCustomizer ? "Hide Customizer" : "Customize Now"}
              </span>
            </button>

            {showCustomizer && (
              <div className={styles.customFields}>
                <div className={styles.fieldRow}>
                  <div className={styles.customField}>
                    <label htmlFor="custom-name">{t.jerseyNameLabel}</label>
                    <input
                      type="text"
                      id="custom-name"
                      placeholder="e.g. MESSI or YOUR NAME"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      maxLength={14}
                      className={styles.customInput}
                    />
                  </div>
                  <div className={styles.customField}>
                    <label htmlFor="custom-number">{t.jerseyNumberLabel}</label>
                    <input
                      type="text"
                      id="custom-number"
                      placeholder="e.g. 10"
                      value={customNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (Number(val) <= 99) setCustomNumber(val);
                      }}
                      maxLength={2}
                      className={styles.customInput}
                    />
                  </div>
                </div>

                {/* Font Option */}
                <div className={styles.fontOptionRow}>
                  <span className={styles.fontLabel}>{t.printingStyle}:</span>
                  <div className={styles.fontBtns}>
                    <button
                      type="button"
                      className={`${styles.fontBtn} ${fontStyle === "league" ? styles.fontBtnActive : ""}`}
                      onClick={() => setFontStyle("league")}
                    >
                      {t.officialFont}
                    </button>
                    <button
                      type="button"
                      className={`${styles.fontBtn} ${fontStyle === "classic" ? styles.fontBtnActive : ""}`}
                      onClick={() => setFontStyle("classic")}
                    >
                      {t.classicFont}
                    </button>
                  </div>
                </div>

                {/* Live Canvas Preview */}
                {(customName || customNumber) && (
                  <div className={styles.livePreviewCard}>
                    <div className={styles.previewHeading}>
                      <BadgeCheckIcon size={14} />
                      <span>Live Heat-Press Preview</span>
                    </div>
                    <div className={styles.previewJerseyBack}>
                      {customName && (
                        <span
                          className={styles.previewName}
                          style={{
                            fontFamily: fontStyle === "league" ? "Outfit, sans-serif" : "Impact, sans-serif",
                          }}
                        >
                          {customName}
                        </span>
                      )}
                      {customNumber && (
                        <span
                          className={styles.previewNumber}
                          style={{
                            fontFamily: fontStyle === "league" ? "Outfit, sans-serif" : "Impact, sans-serif",
                          }}
                        >
                          {customNumber}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quantity & Stock Status */}
        <div className={styles.quantityRow}>
          <div className={styles.quantityControl}>
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className={styles.quantityBtn}
              id="qty-decrease"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={14} />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className={styles.quantityBtn}
              id="qty-increase"
              aria-label="Increase quantity"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          <div className={styles.stockNotice}>
            <span className={styles.stockDot}></span>
            <span>{t.inStock} ({stockCount} units available)</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className={styles.actionButtonGroup}>
          <div className={styles.totalPriceBlock}>
            <span className={styles.totalLabel}>Total Price:</span>
            <span className={styles.totalPrice}>
              ৳{(unitPrice * quantity).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            className={`btn btn-primary btn-lg ${styles.addToCartBtn} ${addedToCart ? styles.addedAnimation : ""}`}
            onClick={handleAddToCart}
            id="add-to-cart-btn"
          >
            {addedToCart ? (
              <>
                <CheckIcon size={20} />
                <span>{t.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBagIcon size={20} />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}
