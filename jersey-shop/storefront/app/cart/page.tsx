"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useStoreData } from "@/lib/context/StoreDataContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import {
  ShoppingBagIcon,
  TruckIcon,
  TagIcon,
  ShieldCheckIcon,
  CloseIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
  CheckCircleIcon,
  RefreshCcwIcon,
  BanknoteIcon,
  BadgeCheckIcon,
} from "@/components/Icons";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, removeItem, updateQuantity, addItem, subtotal, shippingCost, total } =
    useCart();
  const { validateVoucher, settings, vouchers, products } = useStoreData();
  const { t } = useLanguage();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const freeDeliveryThreshold = settings.freeShippingThreshold || 5000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  const applyVoucherCode = (codeToApply: string) => {
    setCouponError("");
    const code = codeToApply.trim().toUpperCase();
    if (!code) return;

    const result = validateVoucher(code, subtotal);
    if (result.valid) {
      setAppliedDiscount({ code, amount: result.discountAmount });
      setCouponCode("");
    } else {
      setCouponError(result.message);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyVoucherCode(couponCode);
  };

  const finalTotal = Math.max(0, total - (appliedDiscount ? appliedDiscount.amount : 0));

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyCart}>
            <div className={styles.emptyIconBox}>
              <ShoppingBagIcon size={44} />
            </div>
            <h1>{t.emptyCartTitle}</h1>
            <p>{t.emptyCartDesc}</p>
            <Link href="/products" className={`btn btn-primary btn-lg ${styles.browseBtn}`} id="continue-shopping">
              <span>{t.shopNow}</span>
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>{t.shoppingCart}</h1>
        <p className={styles.subtitle}>
          You have {items.length} item{items.length !== 1 ? "s" : ""} in your bag
        </p>

        {/* Free Shipping Progress Indicator */}
        <div className={styles.freeShippingProgressCard}>
          <div className={styles.progressHeader}>
            <div className={styles.progressIconTitle}>
              <TruckIcon size={18} className={styles.truckIcon} />
              {remainingForFree === 0 ? (
                <strong className={styles.freeCongrats}>
                  ✓ Congratulations! You unlocked FREE Nationwide Delivery!
                </strong>
              ) : (
                <span>
                  Add <strong>৳{remainingForFree.toLocaleString()}</strong> more to unlock <strong>FREE Delivery</strong>
                </span>
              )}
            </div>
            <span className={styles.progressPercent}>{progressPercent}%</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className={styles.layout}>
          {/* Left Column: Cart Items + Trust Perks */}
          <div className={styles.leftCol}>
            {/* Cart Items List */}
            <div className={styles.itemsList}>
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className={styles.cartItem}
                  id={`cart-item-${item.slug}`}
                >
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={150}
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div>
                        <span className={styles.itemTeamTag}>{item.team}</span>
                        <Link
                          href={`/products/${item.slug}`}
                          className={styles.itemName}
                        >
                          {item.name}
                        </Link>
                        <div className={styles.itemSpecsRow}>
                          <span className={styles.specBadge}>Size: {item.size}</span>
                          {item.customName && (
                            <span className={styles.customBadge}>
                              <SparklesIcon size={12} /> {item.customName}{" "}
                              {item.customNumber && `#${item.customNumber}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label="Remove item"
                        title="Remove from bag"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>

                    <div className={styles.itemBottom}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className={styles.quantityBtn}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className={styles.quantityValue}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className={styles.quantityBtn}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>

                      <div className={styles.itemPriceCol}>
                        <span className={styles.itemPriceTotal}>
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className={styles.itemPriceUnit}>
                            ৳{item.price.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Matchday Trust Perks 4-Pillar Grid */}
            <div className={styles.cartPerksGrid}>
              <div className={styles.perkCard}>
                <div className={styles.perkIconBox}>
                  <ShieldCheckIcon size={18} />
                </div>
                <div>
                  <strong>100% Authentic Match Grade</strong>
                  <p>Certified heat-press prints &amp; aero-weave fabrics.</p>
                </div>
              </div>
              <div className={styles.perkCard}>
                <div className={styles.perkIconBox}>
                  <TruckIcon size={18} />
                </div>
                <div>
                  <strong>24–48h Dhaka Delivery</strong>
                  <p>Rapid dispatch with Pathao SMS tracking nationwide.</p>
                </div>
              </div>
              <div className={styles.perkCard}>
                <div className={styles.perkIconBox}>
                  <RefreshCcwIcon size={18} />
                </div>
                <div>
                  <strong>7-Day Free Size Exchange</strong>
                  <p>Hassle-free doorstep size swap across 64 districts.</p>
                </div>
              </div>
              <div className={styles.perkCard}>
                <div className={styles.perkIconBox}>
                  <BanknoteIcon size={18} />
                </div>
                <div>
                  <strong>bKash &amp; Cash on Delivery</strong>
                  <p>Inspect package physically before finalizing payment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              {/* Voucher Code Form */}
              <div className={styles.couponSection}>
                {appliedDiscount ? (
                  <div className={styles.appliedCouponTag}>
                    <div className={styles.couponInfo}>
                      <TagIcon size={14} />
                      <span>Code <strong>{appliedDiscount.code}</strong> Applied (-৳{appliedDiscount.amount})</span>
                    </div>
                    <button onClick={() => setAppliedDiscount(null)} className={styles.removeCouponBtn}>
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                      <div className={styles.couponInputGroup}>
                        <TagIcon size={16} className={styles.couponIcon} />
                        <input
                          type="text"
                          placeholder="Voucher (e.g. KICKOFF)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className={styles.couponInput}
                        />
                        <button type="submit" className={styles.applyBtn}>
                          Apply
                        </button>
                      </div>
                      {couponError && <span className={styles.couponError}>{couponError}</span>}
                    </form>

                    {/* 1-Tap Quick Apply Voucher Chips */}
                    <div className={styles.quickVouchersRow}>
                      <span className={styles.quickVouchersLabel}>TAP TO APPLY PROMO:</span>
                      <div className={styles.voucherChips}>
                        {vouchers && vouchers.filter((v) => v.isActive).slice(0, 3).map((vch) => (
                          <button
                            key={vch.id}
                            type="button"
                            className={styles.voucherChip}
                            onClick={() => applyVoucherCode(vch.code)}
                          >
                            🏷️ <strong>{vch.code}</strong> ({vch.type === "fixed" ? `৳${vch.value} OFF` : `${vch.value}% OFF`})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtotal */}
              <div className={styles.summaryRow}>
                <span>{t.subtotal}</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>

              {/* Discount if applied */}
              {appliedDiscount && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>Voucher Discount</span>
                  <span>-৳{appliedDiscount.amount.toLocaleString()}</span>
                </div>
              )}

              {/* Shipping */}
              <div className={styles.summaryRow}>
                <span>{t.shipping}</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className={styles.freeBadge}>{t.free}</span>
                  ) : (
                    `৳${shippingCost}`
                  )}
                </span>
              </div>

              {/* Grand Total */}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>{t.total}</span>
                <span className={styles.totalAmount}>৳{finalTotal.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
                id="proceed-checkout"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRightIcon size={18} />
              </Link>

              {/* Security Seal */}
              <div className={styles.securitySealBox}>
                <ShieldCheckIcon size={16} className={styles.shieldIcon} />
                <span>Encrypted 256-bit checkout with buyer protection</span>
              </div>

              <Link href="/products" className={styles.continueShopping}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* "Complete Your Matchday Kit" (Recommended Add-ons Grid) */}
        <div className={styles.recommendedSection}>
          <div className={styles.recommendedHeader}>
            <div>
              <div className={styles.recBadge}>RECOMMENDED FOR YOU</div>
              <h3 className={styles.recommendedTitle}>Complete Your Matchday Kit</h3>
              <p className={styles.recommendedSubtitle}>
                Tournament kits &amp; retro icons supporters are pairing with this order
              </p>
            </div>
            <Link href="/products" className={styles.viewAllKitsLink}>
              <span>Explore Full Catalog</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className={styles.recommendedGrid}>
            {products
              .filter((p) => !items.some((it) => it.productId === p.id))
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className={styles.recItemCard}>
                  <div className={styles.recItemImgBox}>
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width={160}
                      height={190}
                      className={styles.recItemImg}
                    />
                  </div>
                  <div className={styles.recItemInfo}>
                    <span className={styles.recItemTeam}>{p.team}</span>
                    <Link href={`/products/${p.slug}`} className={styles.recItemName}>
                      {p.name}
                    </Link>
                    <span className={styles.recItemPrice}>৳{p.price.toLocaleString()}</span>
                    <button
                      type="button"
                      className={styles.quickAddBtn}
                      onClick={() => {
                        addItem({
                          productId: p.id,
                          name: `${p.name} (Fan Edition)`,
                          slug: p.slug,
                          price: p.price,
                          currency: p.currency,
                          image: p.images[0],
                          size: "M",
                          quantity: 1,
                          team: p.team,
                        });
                      }}
                    >
                      <PlusIcon size={13} />
                      <span>+ Add Size M (৳{p.price})</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
