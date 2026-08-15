"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  UserIcon,
  PackageIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TruckIcon,
  SparklesIcon,
  PlusIcon,
  CheckCircleIcon,
} from "@/components/Icons";
import styles from "./account.module.css";

export default function CustomerAccountPage() {
  const { user, isAuthenticated, logout, addAddress } = useAuth();
  const { orders } = useStoreData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  // Address form modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    address: "",
    district: "Dhaka",
    division: "Dhaka",
    isDefault: false,
  });

  const customerOrders = orders.filter(
    (o) =>
      o.phone === user?.phone ||
      (user?.email && o.email === user.email) ||
      user?.name.toLowerCase() === o.customerName.toLowerCase() ||
      user?.role === "admin"
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.address || !newAddress.phone) return;

    addAddress(newAddress);
    setIsAddingAddress(false);
    setNewAddress({
      label: "Home",
      fullName: "",
      phone: "",
      address: "",
      district: "Dhaka",
      division: "Dhaka",
      isDefault: false,
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Account Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileUserCol}>
            <div className={styles.avatarCircle}>
              <UserIcon size={28} />
            </div>
            <div>
              <div className={styles.userNameBadgeRow}>
                <h1 className={styles.userName}>{user.name}</h1>
                <span className={styles.roleBadge}>Verified Member</span>
              </div>
              <p className={styles.userEmail}>{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className={styles.profileActions}>
            {user.role === "admin" && (
              <Link href="/admin" className="btn btn-primary">
                <ShieldCheckIcon size={16} />
                <span>Admin Operations</span>
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="btn btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabsNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === "orders" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <PackageIcon size={16} />
            <span>Order History ({customerOrders.length})</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <MapPinIcon size={16} />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "profile" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon size={16} />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className={styles.ordersTab}>
            {customerOrders.length > 0 ? (
              <div className={styles.ordersList}>
                {customerOrders.map((ord) => (
                  <div key={ord.id} className={styles.orderCard}>
                    <div className={styles.orderTopBar}>
                      <div className={styles.orderIdGroup}>
                        <span className={styles.orderId}>Order #{ord.id}</span>
                        <span className={styles.orderDate}>{ord.date}</span>
                      </div>
                      <div className={styles.orderStatusGroup}>
                        <span
                          className={`${styles.statusPill} ${
                            ord.status === "Delivered"
                              ? styles.statusDelivered
                              : ord.status === "Printing Queue"
                              ? styles.statusPrinting
                              : ord.status === "Dispatched"
                              ? styles.statusShipped
                              : ""
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    <div className={styles.orderItemsBox}>
                      {ord.itemDetails && ord.itemDetails.length > 0 ? (
                        ord.itemDetails.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <div>
                              <strong>{item.name}</strong>
                              <span style={{ display: "block", fontSize: "12px", color: "#64748B" }}>
                                Size: {item.size} • Qty: {item.quantity}
                                {item.customName && ` • Custom: ${item.customName} #${item.customNumber}`}
                              </span>
                            </div>
                            <span style={{ fontWeight: 800 }}>৳{item.price.toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.orderItemRow}>
                          <div>
                            <strong>{ord.items}</strong>
                            {ord.customDetail && (
                              <span style={{ display: "block", fontSize: "12px", color: "#E5A100", fontWeight: 700 }}>
                                <SparklesIcon size={12} /> {ord.customDetail}
                              </span>
                            )}
                          </div>
                          <span style={{ fontWeight: 800 }}>৳{ord.total.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.orderBottomBar}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748B" }}>
                        <TruckIcon size={16} />
                        <span>Courier Waybill: <strong>{ord.trackingNumber || "Assigned on Dispatch"}</strong></span>
                      </div>
                      <div className={styles.orderTotalRow}>
                        TOTAL: ৳{ord.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconBox}>
                  <PackageIcon size={32} />
                </div>
                <h3 className={styles.emptyTitle}>NO ORDERS PLACED YET</h3>
                <p className={styles.emptyDesc}>
                  Your personalized football kits and matchwear orders will appear here.
                </p>
                <Link href="/products" className="btn btn-primary">
                  <span>EXPLORE JERSEYS</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 900, textTransform: "uppercase" }}>
                  Delivery Addresses
                </h2>
                <p style={{ fontSize: "13px", color: "#64748B" }}>Manage your shipping addresses for fast 1-click checkout</p>
              </div>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="btn btn-primary"
              >
                <PlusIcon size={16} />
                <span>Add Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className={styles.profileCard} style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase" }}>
                  New Shipping Address
                </h3>
                <div className={styles.field}>
                  <label>Address Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="Home / Office / Gym"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full recipient name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House, Road, Area details"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.field}>
                    <label>District *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.district}
                      onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Division *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.division}
                      onChange={(e) => setNewAddress({ ...newAddress, division: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className={styles.addressGrid}>
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div key={addr.id} className={styles.addressCard}>
                    {addr.isDefault && <span className={styles.defaultAddressBadge}>DEFAULT</span>}
                    <span className={styles.addressLabel}>{addr.label}</span>
                    <strong style={{ fontSize: "14px", color: "#000000" }}>{addr.fullName}</strong>
                    <div className={styles.addressDetail}>
                      <p>{addr.phone}</p>
                      <p>{addr.address}</p>
                      <p>{addr.district}, {addr.division}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
                  <MapPinIcon size={32} />
                  <h3 className={styles.emptyTitle}>NO SAVED ADDRESSES</h3>
                  <p className={styles.emptyDesc}>Save your home or work address for faster delivery.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === "profile" && (
          <div className={styles.profileCard}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 900, textTransform: "uppercase" }}>
              Account Settings &amp; Profile
            </h2>
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" disabled value={user.name} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" disabled value={user.email} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input type="tel" disabled value={user.phone} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label>Account Role</label>
              <input type="text" disabled value={user.role.toUpperCase()} className={styles.input} />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => alert("Profile information is synchronized with your NINETY KITS membership.")}
                className="btn btn-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
