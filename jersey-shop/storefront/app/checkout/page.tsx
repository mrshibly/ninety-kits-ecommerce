"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useStoreData } from "@/lib/context/StoreDataContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import {
  TruckIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  BkashLogo,
  NagadLogo,
  RocketLogo,
  VisaLogo,
  MastercardLogo,
  CodLogo,
  PhoneIcon,
  MapPinIcon,
  PackageIcon,
} from "@/components/Icons";
import styles from "./checkout.module.css";

type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "cod";
type DeliveryArea = "dhaka" | "outside";

const BD_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder, settings } = useStoreData();
  const { user, addOrderToUser } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("dhaka");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    division: "Dhaka",
    district: "Dhaka",
    address: "",
    notes: "",
    agreeSms: true,
  });

  useEffect(() => {
    if (user && !form.fullName) {
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      setForm((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        address: defaultAddr ? defaultAddr.address : prev.address,
        district: defaultAddr ? defaultAddr.district : prev.district,
        division: defaultAddr ? defaultAddr.division : prev.division,
      }));
    }
  }, [user]);

  const shippingCost =
    subtotal >= (settings.freeShippingThreshold || 5000)
      ? 0
      : deliveryArea === "dhaka"
      ? settings.shippingInsideDhaka || 80
      : settings.shippingOutsideDhaka || 130;
  const orderTotal = subtotal + shippingCost;

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    const itemsSummary = items.map((i) => `${i.name} (Size ${i.size})`).join(", ");
    const customSummary = items
      .filter((i) => i.customName || i.customNumber)
      .map((i) => `Name: ${i.customName || ""} | No: ${i.customNumber || ""}`)
      .join("; ");

    const pmLabel =
      paymentMethod === "cod"
        ? "Cash on Delivery"
        : paymentMethod === "bkash"
        ? "bKash (Online)"
        : paymentMethod === "nagad"
        ? "Nagad (Online)"
        : paymentMethod === "rocket"
        ? "Rocket (Online)"
        : "Visa / Mastercard";

    const created = createOrder({
      customerName: form.fullName || "Customer",
      phone: form.phone || "01700000000",
      email: form.email,
      address: form.address || "Dhaka, Bangladesh",
      district: form.district || "Dhaka",
      division: form.division || "Dhaka",
      items: itemsSummary || "Sports Jersey Matchwear",
      itemDetails: items.map((i) => ({
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        customName: i.customName,
        customNumber: i.customNumber,
        team: i.team,
        productId: i.productId,
      })),
      customDetail: customSummary || undefined,
      total: orderTotal,
      paymentMethod: pmLabel,
      status: paymentMethod === "cod" ? "Pending COD" : "Printing Queue",
      courier: deliveryArea === "dhaka" ? "Pathao Express" : "Steadfast Courier",
    });

    if (user) {
      addOrderToUser({
        id: created.id,
        date: created.date,
        items: items.map((i) => ({
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          customName: i.customName,
          customNumber: i.customNumber,
        })),
        total: orderTotal,
        paymentMethod: pmLabel,
        status: paymentMethod === "cod" ? "Pending COD" : "Printing",
        trackingNumber: created.trackingNumber,
      });
    }

    setOrderId(created.id);
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <ShoppingBagIcon size={40} />
            </div>
            <h1>No Items Ready for Checkout</h1>
            <p>Your bag is empty. Please pick a jersey before placing an order.</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              <span>Browse Jerseys Catalog</span>
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Order Confirmed Success Screen
  if (orderPlaced) {
    const merchantNum =
      paymentMethod === "bkash"
        ? settings.merchantBkashNumber || "01800-909090"
        : paymentMethod === "nagad"
        ? settings.merchantNagadNumber || "01800-909090"
        : settings.merchantRocketNumber || "01800-909090";

    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.successState}>
            <div className={styles.successIconBox}>
              <CheckCircleIcon size={44} />
            </div>

            <span className={styles.orderIdBadge}>
              Order ID: <strong>{orderId}</strong>
            </span>

            <h1 className={styles.successHeading}>{t.orderSuccessTitle}</h1>
            <p className={styles.successMsg}>{t.orderSuccessDesc}</p>

            <div className={styles.successSummaryCard}>
              <div className={styles.successRow}>
                <span>Order Reference:</span>
                <strong>{orderId}</strong>
              </div>
              <div className={styles.successRow}>
                <span>Recipient:</span>
                <span>{form.fullName} ({form.phone})</span>
              </div>
              <div className={styles.successRow}>
                <span>Delivery Address:</span>
                <span>{form.address}, {form.district}</span>
              </div>
              <div className={styles.successRow}>
                <span>Payment Method:</span>
                <span className={styles.paymentMethodPill}>{paymentMethod.toUpperCase()}</span>
              </div>
              <div className={styles.successRow}>
                <span>Estimated Delivery:</span>
                <span>{deliveryArea === "dhaka" ? "1-2 Business Days" : "3-4 Business Days"}</span>
              </div>
              <div className={`${styles.successRow} ${styles.successTotalRow}`}>
                <span>Total Payable:</span>
                <strong className={styles.grandTotalText}>৳{orderTotal.toLocaleString()}</strong>
              </div>
            </div>

            {/* Instruction box for bKash/Nagad */}
            {(paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket") && (
              <div className={styles.paymentInstructionBox}>
                <h4>
                  <PhoneIcon size={16} /> Merchant Payment Instructions:
                </h4>
                <p>
                  Please send <strong>৳{orderTotal.toLocaleString()}</strong> via {paymentMethod.toUpperCase()} Merchant Make Payment / Send Money to <strong>{merchantNum}</strong> (Reference: <strong>{orderId}</strong>).
                </p>
              </div>
            )}

            <div className={styles.successActions}>
              <Link href="/track-order" className="btn btn-primary btn-lg">
                <PackageIcon size={18} />
                <span>Track Order Live</span>
              </Link>
              <Link href="/products" className="btn btn-secondary btn-lg">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Secure Checkout</h1>

        {/* 3-Step Progress Indicator */}
        <div className={styles.stepper}>
          <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ""}`}>
            <span className={styles.stepNumber}>
              {step > 1 ? <CheckCircleIcon size={16} /> : "1"}
            </span>
            <span className={styles.stepTitle}>Delivery Info</span>
          </div>

          <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ""}`}></div>

          <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ""}`}>
            <span className={styles.stepNumber}>
              {step > 2 ? <CheckCircleIcon size={16} /> : "2"}
            </span>
            <span className={styles.stepTitle}>Payment</span>
          </div>

          <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : ""}`}></div>

          <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ""}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepTitle}>Confirm</span>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Main Form Area */}
          <div className={styles.formContainer}>
            {/* STEP 1: Delivery Address */}
            {step === 1 && (
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <TruckIcon size={20} className={styles.headerIcon} />
                  <div>
                    <h2 className={styles.formHeading}>Delivery &amp; Recipient Details</h2>
                    <p className={styles.formSub}>Enter your shipping destination across all 64 districts</p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="e.g. Tanvir Ahmed"
                      value={form.fullName}
                      onChange={(e) => updateForm("fullName", e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phone">Phone Number (11 digits) *</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="01XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email Address (Optional for e-invoice)</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="tanvir@example.com"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label htmlFor="division">Division *</label>
                    <select
                      id="division"
                      value={form.division}
                      onChange={(e) => {
                        updateForm("division", e.target.value);
                        setDeliveryArea(e.target.value === "Dhaka" ? "dhaka" : "outside");
                      }}
                      className={styles.select}
                    >
                      {BD_DIVISIONS.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="district">District / City *</label>
                    <input
                      type="text"
                      id="district"
                      placeholder="e.g. Dhaka, Chittagong, Sylhet"
                      value={form.district}
                      onChange={(e) => updateForm("district", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="address">Full Street Address (House, Road, Thana/Area) *</label>
                  <textarea
                    id="address"
                    placeholder="House 12, Road 5, Sector 11, Uttara"
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    rows={3}
                    className={styles.textarea}
                  />
                </div>

                {/* Delivery Area Toggle */}
                <div className={styles.field}>
                  <label>Shipping Zone Rate</label>
                  <div className={styles.areaOptions}>
                    <button
                      type="button"
                      className={`${styles.areaCard} ${deliveryArea === "dhaka" ? styles.areaActive : ""}`}
                      onClick={() => setDeliveryArea("dhaka")}
                    >
                      <MapPinIcon size={18} />
                      <div className={styles.areaInfo}>
                        <strong>Inside Dhaka City</strong>
                        <span>1-2 Days (৳60)</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`${styles.areaCard} ${deliveryArea === "outside" ? styles.areaActive : ""}`}
                      onClick={() => setDeliveryArea("outside")}
                    >
                      <MapPinIcon size={18} />
                      <div className={styles.areaInfo}>
                        <strong>Outside Dhaka (All 64 Districts)</strong>
                        <span>3-4 Days (৳120)</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className={styles.smsCheckbox}>
                  <input
                    type="checkbox"
                    id="agreeSms"
                    checked={form.agreeSms}
                    onChange={(e) => updateForm("agreeSms", e.target.checked)}
                  />
                  <label htmlFor="agreeSms">
                    Receive free real-time SMS tracking updates when order is dispatched
                  </label>
                </div>

                <button
                  type="button"
                  className={`btn btn-primary btn-lg ${styles.nextBtn}`}
                  onClick={() => {
                    if (!form.fullName || !form.phone || !form.address) {
                      alert("Please fill in your name, phone number, and delivery address.");
                      return;
                    }
                    setStep(2);
                  }}
                  id="checkout-step1-next"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRightIcon size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <CreditCardIcon size={20} className={styles.headerIcon} />
                  <div>
                    <h2 className={styles.formHeading}>Choose Payment Method</h2>
                    <p className={styles.formSub}>Instant Mobile Banking or Cash on Delivery</p>
                  </div>
                </div>

                <div className={styles.paymentMethodsList}>
                  {/* bKash */}
                  <label
                    className={`${styles.paymentCard} ${paymentMethod === "bkash" ? styles.paymentActive : ""}`}
                    onClick={() => setPaymentMethod("bkash")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "bkash"}
                      onChange={() => setPaymentMethod("bkash")}
                    />
                    <BkashLogo height={24} />
                    <div className={styles.paymentText}>
                      <strong>bKash Payment</strong>
                      <span>Pay directly via bKash Merchant Account (01800-909090)</span>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`${styles.paymentCard} ${paymentMethod === "nagad" ? styles.paymentActive : ""}`}
                    onClick={() => setPaymentMethod("nagad")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "nagad"}
                      onChange={() => setPaymentMethod("nagad")}
                    />
                    <NagadLogo height={24} />
                    <div className={styles.paymentText}>
                      <strong>Nagad Payment</strong>
                      <span>Pay securely via Nagad Gateway / Send Money</span>
                    </div>
                  </label>

                  {/* Rocket */}
                  <label
                    className={`${styles.paymentCard} ${paymentMethod === "rocket" ? styles.paymentActive : ""}`}
                    onClick={() => setPaymentMethod("rocket")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "rocket"}
                      onChange={() => setPaymentMethod("rocket")}
                    />
                    <RocketLogo height={24} />
                    <div className={styles.paymentText}>
                      <strong>Dutch-Bangla Rocket</strong>
                      <span>Pay via DBBL Rocket wallet</span>
                    </div>
                  </label>

                  {/* Visa / Master */}
                  <label
                    className={`${styles.paymentCard} ${paymentMethod === "card" ? styles.paymentActive : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div style={{ display: "flex", gap: 4 }}>
                      <VisaLogo height={22} />
                      <MastercardLogo height={22} />
                    </div>
                    <div className={styles.paymentText}>
                      <strong>Credit / Debit Card (SSLCommerz)</strong>
                      <span>Visa, Mastercard, AMEX, City Bank, Brac Bank</span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`${styles.paymentCard} ${paymentMethod === "cod" ? styles.paymentActive : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <CodLogo height={24} />
                    <div className={styles.paymentText}>
                      <strong>Cash on Delivery (COD)</strong>
                      <span>Inspect package and pay cash to rider upon delivery</span>
                    </div>
                  </label>
                </div>

                <div className={styles.stepActions}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeftIcon size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setStep(3)}
                    id="checkout-step2-next"
                  >
                    <span>Review Order</span>
                    <ArrowRightIcon size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review and Confirm */}
            {step === 3 && (
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <CheckCircleIcon size={20} className={styles.headerIcon} />
                  <div>
                    <h2 className={styles.formHeading}>Order Review &amp; Confirmation</h2>
                    <p className={styles.formSub}>Please verify your items and shipping details</p>
                  </div>
                </div>

                <div className={styles.reviewBlocks}>
                  {/* Shipping Box */}
                  <div className={styles.reviewBox}>
                    <span className={styles.reviewBoxLabel}>Recipient &amp; Destination</span>
                    <strong>{form.fullName}</strong>
                    <p>{form.phone}</p>
                    <p>{form.address}, {form.district}, {form.division}</p>
                  </div>

                  {/* Payment Box */}
                  <div className={styles.reviewBox}>
                    <span className={styles.reviewBoxLabel}>Payment Selection</span>
                    <strong>{paymentMethod.toUpperCase()}</strong>
                    <p>{paymentMethod === "cod" ? "Pay rider in cash upon receiving kit" : "Mobile / Card gateway"}</p>
                  </div>
                </div>

                {/* Items Summary list */}
                <div className={styles.reviewItemsList}>
                  <span className={styles.reviewBoxLabel}>Ordered Kits ({items.length})</span>
                  {items.map((item, i) => (
                    <div key={i} className={styles.reviewItemRow}>
                      <div>
                        <strong>{item.name}</strong>
                        <span className={styles.reviewItemSpecs}>
                          Size: {item.size} • Qty: {item.quantity}
                          {item.customName && ` • Custom: ${item.customName} #${item.customNumber || ""}`}
                        </span>
                      </div>
                      <span className={styles.reviewItemPrice}>
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.stepActions}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeftIcon size={16} />
                    <span>Back to Payment</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary btn-lg ${styles.confirmOrderBtn}`}
                    onClick={handlePlaceOrder}
                    id="place-order-btn"
                  >
                    <ShieldCheckIcon size={20} />
                    <span>Place Order (৳{orderTotal.toLocaleString()})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Cart Overview</h3>

              <div className={styles.sidebarItems}>
                {items.map((item, i) => (
                  <div key={i} className={styles.sidebarItemRow}>
                    <span className={styles.sidebarItemName}>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span className={styles.sidebarItemPrice}>
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Shipping ({deliveryArea === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className={styles.freeBadge}>FREE</span>
                  ) : (
                    `৳${shippingCost}`
                  )}
                </span>
              </div>

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Payable Total</span>
                <span className={styles.totalAmount}>৳{orderTotal.toLocaleString()}</span>
              </div>

              <div className={styles.guaranteePill}>
                <ShieldCheckIcon size={16} className={styles.guaranteeIcon} />
                <span>100% Satisfaction &amp; Size Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
