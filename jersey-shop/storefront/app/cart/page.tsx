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
} from "@/components/Icons";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total } =
    useCart();
  const { validateVoucher, settings } = useStoreData();
  const { t } = useLanguage();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const freeDeliveryThreshold = settings.freeShippingThreshold || 5000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const result = validateVoucher(code, subtotal);
    if (result.valid) {
      setAppliedDiscount({ code, amount: result.discountAmount });
      setCouponCode("");
    } else {
      setCouponError(result.message);
    }
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
                  Congratulations! You unlocked FREE Nationwide Delivery!
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

          {/* Order Summary Sidebar */}
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
                  <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                    <div className={styles.couponInputGroup}>
                      <TagIcon size={16} className={styles.couponIcon} />
                      <input
                        type="text"
                        placeholder="Voucher (e.g. KICKOFF10)"
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
      </div>
    </div>
  );
}
