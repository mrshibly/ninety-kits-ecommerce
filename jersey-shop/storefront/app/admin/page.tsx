"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useStoreData, StoreOrder, Voucher } from "@/lib/context/StoreDataContext";
import { Product } from "@/lib/data/products";
import {
  ShieldCheckIcon,
  PackageIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
  PhoneIcon,
  ArrowRightIcon,
  BoltIcon,
  UserIcon,
  TagIcon,
  FilterIcon,
  PlusIcon,
  CloseIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/Icons";
import styles from "./admin.module.css";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustProductStock,
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    vouchers,
    addVoucher,
    toggleVoucher,
    deleteVoucher,
    heroBanner,
    updateHeroBanner,
  } = useStoreData();

  const [activeTab, setActiveTab] = useState<"orders" | "printing" | "cod" | "inventory" | "vouchers" | "hero">("orders");
  const [heroForm, setHeroForm] = useState(heroBanner);
  const [heroSavedNotice, setHeroSavedNotice] = useState(false);

  useEffect(() => {
    if (heroBanner) {
      setHeroForm(heroBanner);
    }
  }, [heroBanner]);

  // Hero Image Presets
  const HERO_IMAGE_PRESETS = [
    { label: "⚽ Match Action Stadium", url: "/images/hero_banner.jpg" },
    { label: "🇧🇷 Brazil Gold Kit", url: "/images/brazil_kit.jpg" },
    { label: "🇧🇩 Bangladesh Pride", url: "/images/bangladesh_kit.jpg" },
    { label: "🇪🇸 Real Madrid White", url: "/images/real_madrid_kit.jpg" },
    { label: "🇦🇷 Argentina 3-Star", url: "/images/argentina_kit.jpg" },
  ];

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

  // Jersey Studio Image Presets
  const JERSEY_IMAGE_PRESETS = [
    { label: "🇧🇷 Brazil Kit", url: "/images/brazil_kit.jpg" },
    { label: "🇪🇸 Real Madrid", url: "/images/real_madrid_kit.jpg" },
    { label: "🇪🇸 Barcelona", url: "/images/barcelona_kit.jpg" },
    { label: "🇬🇧 Man United", url: "/images/man_united_kit.jpg" },
    { label: "🇧🇩 Bangladesh", url: "/images/bangladesh_kit.jpg" },
    { label: "🇦🇷 Argentina", url: "/images/argentina_kit.jpg" },
    { label: "🇬🇧 Liverpool", url: "/images/liverpool_kit.jpg" },
    { label: "🇫🇷 PSG Kit", url: "/images/psg_kit.jpg" },
  ];

  // New Product Form state
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    team: "",
    league: "Premier League",
    category: "club" as "club" | "national",
    edition: "Fan Version" as "Fan Version" | "Player Issue / Match Edition",
    price: 1500,
    originalPrice: 1800,
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockCount: 50,
    isCustomizable: true,
    image: "/images/brazil_kit.jpg",
    description: "Premium match jersey engineered with breathable moisture-wicking technology.",
  });

  // New Voucher Form
  const [newVoucherForm, setNewVoucherForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "flat",
    value: 10,
    minSpend: 1500,
    expires: "31 Dec 2026",
    isActive: true,
  });

  // Manual Order Form
  const [manualOrderForm, setManualOrderForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    district: "Dhaka",
    division: "Dhaka",
    items: "Bangladesh National Team Official Kit (Size L)",
    customDetail: "Name: CAPTAIN | No: 10",
    total: 1460,
    paymentMethod: "Cash on Delivery",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  // ----------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // ----------------------------------------------------
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim() || !newProductForm.team.trim()) return;

    const slug = newProductForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const selectedImage = newProductForm.image.trim() || "/images/brazil_kit.jpg";

    addProduct({
      name: newProductForm.name,
      slug,
      team: newProductForm.team,
      league: newProductForm.league,
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice),
      currency: "৳",
      images: [selectedImage],
      description: newProductForm.description,
      category: newProductForm.category,
      edition: newProductForm.edition,
      sizes: newProductForm.sizes,
      isCustomizable: newProductForm.isCustomizable,
      inStock: Number(newProductForm.stockCount) > 0,
      stockCount: Number(newProductForm.stockCount),
      rating: 5.0,
      reviewCount: 0,
      badge: "New Arrival",
      colors: ["Home Kit", "Away Kit"],
      specs: {
        fabric: "100% Recycled Poly-Mesh",
        fit: "Athletic Fit",
        technology: "Dri-FIT Breathability",
        care: "Machine wash cold",
        origin: "Imported Master Grade",
      },
      reviews: [],
    });

    setIsAddModalOpen(false);
    setNewProductForm({
      name: "",
      team: "",
      league: "Premier League",
      category: "club",
      edition: "Fan Version",
      price: 1500,
      originalPrice: 1800,
      sizes: ["S", "M", "L", "XL", "XXL"],
      stockCount: 50,
      isCustomizable: true,
      description: "Premium match jersey engineered with breathable moisture-wicking technology.",
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this jersey product from the live catalog?")) {
      deleteProduct(productId);
    }
  };

  // ----------------------------------------------------
  // ORDER CRUD HANDLERS
  // ----------------------------------------------------
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderForm.customerName || !manualOrderForm.phone) return;

    createOrder({
      customerName: manualOrderForm.customerName,
      phone: manualOrderForm.phone,
      address: manualOrderForm.address,
      district: manualOrderForm.district,
      division: manualOrderForm.division,
      items: manualOrderForm.items,
      itemDetails: [
        {
          name: manualOrderForm.items,
          size: "L",
          quantity: 1,
          price: Number(manualOrderForm.total),
          customName: manualOrderForm.customDetail.split("|")[0]?.replace("Name:", "").trim(),
          customNumber: manualOrderForm.customDetail.split("|")[1]?.replace("No:", "").trim(),
        },
      ],
      customDetail: manualOrderForm.customDetail,
      total: Number(manualOrderForm.total),
      paymentMethod: manualOrderForm.paymentMethod,
      status: "Printing Queue",
      courier: "Pathao Express",
    });

    setIsManualOrderOpen(false);
    setManualOrderForm({
      customerName: "",
      phone: "",
      address: "",
      district: "Dhaka",
      division: "Dhaka",
      items: "Bangladesh National Team Official Kit (Size L)",
      customDetail: "Name: CAPTAIN | No: 10",
      total: 1460,
      paymentMethod: "Cash on Delivery",
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Cancel and delete order #${orderId}?`)) {
      deleteOrder(orderId);
    }
  };

  // ----------------------------------------------------
  // VOUCHER CRUD HANDLERS
  // ----------------------------------------------------
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherForm.code.trim()) return;

    addVoucher({
      code: newVoucherForm.code.toUpperCase().trim(),
      type: newVoucherForm.type,
      value: Number(newVoucherForm.value),
      minSpend: Number(newVoucherForm.minSpend),
      isActive: true,
      expires: newVoucherForm.expires,
    });

    setIsAddVoucherOpen(false);
    setNewVoucherForm({
      code: "",
      type: "percentage",
      value: 10,
      minSpend: 1500,
      expires: "31 Dec 2026",
      isActive: true,
    });
  };

  if (!user || user.role !== "admin") return null;

  const totalGrossRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const printingCount = orders.filter((o) => o.status === "Printing Queue").length;
  const pendingCodCount = orders.filter((o) => o.status === "Pending COD").length;

  return (
    <div className={styles.adminLayout}>
      {/* Dedicated Enterprise Admin Header Bar */}
      <header className={styles.adminHeaderBar}>
        <div className={`container ${styles.adminHeaderContent}`}>
          <div className={styles.adminBrand}>
            <span className={styles.adminBrandBadge}>
              <BoltIcon size={18} />
            </span>
            <div className={styles.adminBrandText}>
              <div className={styles.adminTitleRow}>
                <span className={styles.adminBrandName}>NINETY KITS</span>
                <span className={styles.adminBadgeLive}>● LIVE OPERATIONS</span>
              </div>
              <span className={styles.adminEnvTag}>Full Store Context &amp; Real-Time Sync</span>
            </div>
          </div>

          <div className={styles.adminUserActions}>
            <button
              className={styles.headerPrimaryBtn}
              onClick={() => setIsManualOrderOpen(true)}
              id="admin-manual-order-btn"
            >
              <PlusIcon size={15} />
              <span>Manual Phone Order</span>
            </button>
            <Link href="/" className={styles.headerOutlineBtn} target="_blank">
              <span>Live Storefront ↗</span>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className={styles.headerSignOutBtn}
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="container" style={{ paddingTop: "24px", paddingBottom: "60px" }}>
        {/* KPI Metrics Row */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconBox}>
              <TagIcon size={20} />
            </div>
            <div>
              <span className={styles.kpiLabel}>Total Orders Value</span>
              <strong className={styles.kpiValue}>৳{totalGrossRevenue.toLocaleString()}</strong>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIconBox} ${styles.kpiIconGold}`}>
              <SparklesIcon size={20} />
            </div>
            <div>
              <span className={styles.kpiLabel}>Heat-Press Queue</span>
              <strong className={styles.kpiValue}>{printingCount} Pending</strong>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIconBox} ${styles.kpiIconWarning}`}>
              <PhoneIcon size={20} />
            </div>
            <div>
              <span className={styles.kpiLabel}>COD Verification</span>
              <strong className={styles.kpiValue}>{pendingCodCount} Orders</strong>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIconBox} ${styles.kpiIconEmerald}`}>
              <PackageIcon size={20} />
            </div>
            <div>
              <span className={styles.kpiLabel}>Live Catalog SKUs</span>
              <strong className={styles.kpiValue}>{products.length} Kits</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.adminTabs}>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "orders" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <PackageIcon size={16} />
            <span>Orders Dynamic Queue ({orders.length})</span>
          </button>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "printing" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("printing")}
          >
            <SparklesIcon size={16} />
            <span>Heat-Press Printing Studio ({printingCount})</span>
          </button>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "cod" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("cod")}
          >
            <PhoneIcon size={16} />
            <span>COD Phone Verification ({pendingCodCount})</span>
          </button>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "inventory" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            <FilterIcon size={16} />
            <span>Products &amp; Inventory CRUD ({products.length})</span>
          </button>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "vouchers" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("vouchers")}
          >
            <TagIcon size={16} />
            <span>Discount Vouchers CRUD ({vouchers.length})</span>
          </button>
          <button
            className={`${styles.adminTabBtn} ${activeTab === "hero" ? styles.adminTabActive : ""}`}
            onClick={() => setActiveTab("hero")}
          >
            <SparklesIcon size={16} />
            <span>Storefront Hero &amp; Banners</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: DYNAMIC ORDERS CRUD
           ========================================================= */}
        {activeTab === "orders" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Live Store Orders (Real-time Dynamic State)</h3>
                <span>Manage order workflow, courier tracking numbers, and customer details</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setIsManualOrderOpen(true)}
              >
                <PlusIcon size={16} />
                <span>Create Manual Order</span>
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID &amp; Date</th>
                    <th>Customer &amp; District</th>
                    <th>Ordered Kit &amp; Customization</th>
                    <th>Amount &amp; Payment</th>
                    <th>Status</th>
                    <th>Actions &amp; Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className={styles.orderIdCell}>
                        <strong>{ord.id}</strong>
                        <span className={styles.subText}>{ord.date}</span>
                        {ord.trackingNumber && (
                          <span className={styles.subText} style={{ fontFamily: "monospace", color: "var(--color-emerald-dark)" }}>
                            {ord.trackingNumber}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>{ord.customerName}</strong>
                        <span className={styles.subText}>{ord.phone}</span>
                        <span className={styles.subText}>{ord.address}, {ord.district}</span>
                      </td>
                      <td>
                        <strong>{ord.items}</strong>
                        {ord.customDetail && (
                          <span className={styles.customBadgeText}>
                            <SparklesIcon size={12} /> {ord.customDetail}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>৳{ord.total.toLocaleString()}</strong>
                        <span className={styles.subText}>{ord.paymentMethod}</span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            ord.status === "Delivered"
                              ? styles.badgeDelivered
                              : ord.status === "Dispatched"
                              ? styles.badgeDispatched
                              : ord.status === "Printing Queue"
                              ? styles.badgePrinting
                              : styles.badgePending
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGroup}>
                          {ord.status === "Pending COD" && (
                            <button
                              className={styles.actionBtnConfirm}
                              onClick={() => updateOrderStatus(ord.id, "Printing Queue")}
                            >
                              Verify COD
                            </button>
                          )}
                          {ord.status === "Printing Queue" && (
                            <button
                              className={styles.actionBtnPrint}
                              onClick={() => updateOrderStatus(ord.id, "Quality Checked")}
                            >
                              Done Printing
                            </button>
                          )}
                          {ord.status === "Quality Checked" && (
                            <button
                              className={styles.actionBtnDispatch}
                              onClick={() =>
                                updateOrderStatus(
                                  ord.id,
                                  "Dispatched",
                                  `PTH-${ord.id.replace("NK-", "")}-BD`
                                )
                              }
                            >
                              Book Pathao
                            </button>
                          )}
                          {ord.status === "Dispatched" && (
                            <button
                              className={styles.actionBtnDeliver}
                              onClick={() => updateOrderStatus(ord.id, "Delivered")}
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button
                            className={styles.actionBtnDelete}
                            onClick={() => handleDeleteOrder(ord.id)}
                            title="Cancel / Delete Order"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: PRINTING QUEUE
           ========================================================= */}
        {activeTab === "printing" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3>Heat-Press Printing Studio Queue</h3>
              <span>Send orders directly to pneumatic heat press machine (160°C • 15s)</span>
            </div>

            <div className={styles.printingQueueGrid}>
              {orders
                .filter((o) => o.status === "Printing Queue")
                .map((ord) => (
                  <div key={ord.id} className={styles.printingCard}>
                    <div className={styles.printingCardTop}>
                      <span className={styles.printOrderId}>Order #{ord.id}</span>
                      <span className={styles.printKitTitle}>{ord.items}</span>
                    </div>

                    <div className={styles.printCanvasMockup}>
                      <span className={styles.mockupName}>
                        {ord.customDetail?.split("|")[0]?.replace("Name:", "").trim() || "PLAYER"}
                      </span>
                      <span className={styles.mockupNumber}>
                        {ord.customDetail?.split("|")[1]?.replace("No:", "").replace("(Official Font)", "").trim() || "10"}
                      </span>
                    </div>

                    <div className={styles.printSpecsRow}>
                      <span>Typography: Official League Heat-Film</span>
                      <span>Press: 160°C • 15 Seconds</span>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(ord.id, "Quality Checked")}
                    >
                      <CheckCircleIcon size={16} />
                      <span>Confirm Printing Completed</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: COD PHONE VERIFICATION
           ========================================================= */}
        {activeTab === "cod" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3>Cash on Delivery (COD) Phone Verification</h3>
              <span>Call customer to verify address before cutting fabric and printing</span>
            </div>

            <div className={styles.codList}>
              {orders
                .filter((o) => o.status === "Pending COD")
                .map((ord) => (
                  <div key={ord.id} className={styles.codCard}>
                    <div className={styles.codDetails}>
                      <h4>{ord.customerName}</h4>
                      <p><strong>Phone:</strong> {ord.phone}</p>
                      <p><strong>Address:</strong> {ord.address}, {ord.district}</p>
                      <p><strong>Order Items:</strong> {ord.items}</p>
                      <p><strong>Payable Amount:</strong> ৳{ord.total.toLocaleString()}</p>
                    </div>

                    <div className={styles.codActions}>
                      <a href={`tel:${ord.phone}`} className="btn btn-secondary">
                        <PhoneIcon size={16} />
                        <span>Call Customer</span>
                      </a>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateOrderStatus(ord.id, "Printing Queue")}
                      >
                        <CheckCircleIcon size={16} />
                        <span>Verified — Start Printing</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: DYNAMIC PRODUCTS & INVENTORY CRUD
           ========================================================= */}
        {activeTab === "inventory" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Dynamic Jersey Catalog (Full CRUD Synchronized)</h3>
                <span>Add, update, or remove jerseys. Changes instantly appear across the entire site!</span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
                id="admin-add-product-btn"
              >
                <PlusIcon size={16} />
                <span>Add New Jersey Product</span>
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jersey Product</th>
                    <th>League &amp; Team</th>
                    <th>Edition</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Quick Stock</th>
                    <th>Manage CRUD</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <strong>{prod.name}</strong>
                      </td>
                      <td>
                        <span>{prod.team} ({prod.league})</span>
                      </td>
                      <td>
                        <span className={styles.editionPill}>{prod.edition}</span>
                      </td>
                      <td>
                        <strong>৳{prod.price.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span
                          className={`${styles.stockStatusPill} ${
                            prod.stockCount > 20 ? styles.stockGood : styles.stockLow
                          }`}
                        >
                          {prod.stockCount} in stock
                        </span>
                      </td>
                      <td>
                        <div className={styles.stockAdjustGroup}>
                          <button
                            className={styles.stockBtn}
                            onClick={() => adjustProductStock(prod.id, -5)}
                          >
                            -5
                          </button>
                          <button
                            className={styles.stockBtn}
                            onClick={() => adjustProductStock(prod.id, +5)}
                          >
                            +5
                          </button>
                          <button
                            className={styles.stockBtn}
                            onClick={() => adjustProductStock(prod.id, +20)}
                          >
                            +20
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.crudActionGroup}>
                          <button
                            className={styles.editBtn}
                            onClick={() => setEditingProduct(prod)}
                            title="Edit Product"
                          >
                            <EditIcon size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Delete Product"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: DISCOUNT VOUCHERS CRUD
           ========================================================= */}
        {activeTab === "vouchers" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Promo Coupons &amp; Discount Vouchers CRUD</h3>
                <span>Create promo codes. Customers can immediately redeem them in Cart and Checkout!</span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddVoucherOpen(true)}
              >
                <PlusIcon size={16} />
                <span>Create Voucher Code</span>
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Voucher Code</th>
                    <th>Discount Rate</th>
                    <th>Min Spend</th>
                    <th>Usage Count</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Manage CRUD</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong className={styles.voucherCodeBadge}>{v.code}</strong>
                      </td>
                      <td>
                        <strong>{v.type === "percentage" ? `${v.value}% OFF` : `৳${v.value} FLAT`}</strong>
                      </td>
                      <td>৳{v.minSpend.toLocaleString()}</td>
                      <td>{v.usageCount} times redeemed</td>
                      <td>{v.expires}</td>
                      <td>
                        <button
                          onClick={() => toggleVoucher(v.id)}
                          className={`${styles.toggleStatusBtn} ${v.isActive ? styles.toggleActive : styles.toggleInactive}`}
                        >
                          {v.isActive ? "ACTIVE" : "DISABLED"}
                        </button>
                      </td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteVoucher(v.id)}
                          title="Delete Voucher"
                        >
                          <TrashIcon size={14} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: STOREFRONT HERO & CAMPAIGN MANAGEMENT
           ========================================================= */}
        {activeTab === "hero" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Storefront Hero Banner &amp; Campaign Manager</h3>
                <span>Update the flagship match action photograph, promotional badges, and primary heading in real time</span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  updateHeroBanner(heroForm);
                  setHeroSavedNotice(true);
                  setTimeout(() => setHeroSavedNotice(false), 3500);
                }}
              >
                <CheckCircleIcon size={16} />
                <span>Save &amp; Publish Hero Changes</span>
              </button>
            </div>

            {heroSavedNotice && (
              <div className={styles.successToastBar}>
                <CheckCircleIcon size={18} />
                <span>Hero Banner changes published live to Homepage!</span>
              </div>
            )}

            <div className={styles.heroManagerLayout}>
              {/* Visual Live Mockup Preview */}
              <div className={styles.heroMockupCard}>
                <span className={styles.mockupCardLabel}>LIVE HOMEPAGE PREVIEW</span>
                <div className={styles.heroPreviewFrame}>
                  {heroForm.image ? (
                    <img
                      src={heroForm.image}
                      alt="Hero Preview"
                      className={styles.heroPreviewImg}
                    />
                  ) : (
                    <div className={styles.heroPreviewPlaceholder}>No Banner Selected</div>
                  )}
                  <div className={styles.heroPreviewOverlay}></div>
                  <div className={styles.heroPreviewContent}>
                    <span className={styles.heroMockBadge}>{heroForm.badge || "NEW 2026/27 SEASON DROPS"}</span>
                    <h2 className={styles.heroMockTitle}>{heroForm.title || "NEVER NOT MATCH READY"}</h2>
                    <p className={styles.heroMockSub}>{heroForm.subtitle || "OFFICIAL 2026/27 CLUB & NATIONAL TEAM KITS"}</p>
                    <div className={styles.heroMockBtnRow}>
                      <span className={styles.heroMockBtn}>SHOP CLUB KITS</span>
                      <span className={styles.heroMockBtn}>SHOP NATIONAL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Controls */}
              <div className={styles.heroControlsCard}>
                <div className={styles.imageSelectorBox}>
                  <div className={styles.imageSelectorHeader}>
                    <label className={styles.fieldLabel}>HERO BANNER PHOTOGRAPH *</label>
                    <span className={styles.imageHelpText}>Select preset, enter image path / URL, or upload from device</span>
                  </div>

                  {/* Quick Presets */}
                  <div className={styles.presetButtonsRow}>
                    {HERO_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        className={`${styles.presetBtn} ${heroForm.image === preset.url ? styles.presetBtnActive : ""}`}
                        onClick={() => setHeroForm({ ...heroForm, image: preset.url })}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Manual URL or File Upload */}
                  <div className={styles.imageInputsRow}>
                    <input
                      type="text"
                      placeholder="Image Path or URL (e.g. /images/hero_banner.jpg)"
                      value={heroForm.image}
                      onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                      className={styles.modalInput}
                    />
                    <label className={styles.fileUploadBtn}>
                      <span>Browse File</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              if (uploadEvent.target?.result) {
                                setHeroForm({
                                  ...heroForm,
                                  image: uploadEvent.target.result as string,
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Top Promotional Badge</label>
                  <input
                    type="text"
                    value={heroForm.badge}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    className={styles.modalInput}
                    placeholder="e.g. NEW 2026/27 SEASON DROPS"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Main Headline Title *</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className={styles.modalInput}
                    placeholder="e.g. NEVER NOT MATCH READY"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Subtitle Tagline</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className={styles.modalInput}
                    placeholder="e.g. OFFICIAL 2026/27 CLUB & NATIONAL TEAM KITS"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: ADD NEW JERSEY PRODUCT
         ========================================================= */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <PackageIcon size={20} />
                <h3>Add New Jersey Product to Live Catalog</h3>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className={styles.modalForm}>
              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="modal-name">Jersey Name *</label>
                  <input
                    type="text"
                    id="modal-name"
                    required
                    placeholder="e.g. Germany Home Kit 2026 World Edition"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="modal-team">Team / Club Name *</label>
                  <input
                    type="text"
                    id="modal-team"
                    required
                    placeholder="e.g. Germany"
                    value={newProductForm.team}
                    onChange={(e) => setNewProductForm({ ...newProductForm, team: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.formRow3}>
                <div className={styles.formField}>
                  <label htmlFor="modal-league">League / Competition *</label>
                  <select
                    id="modal-league"
                    value={newProductForm.league}
                    onChange={(e) => setNewProductForm({ ...newProductForm, league: e.target.value })}
                    className={styles.modalSelect}
                  >
                    <option value="Premier League">Premier League</option>
                    <option value="La Liga">La Liga</option>
                    <option value="International">International</option>
                    <option value="Ligue 1">Ligue 1</option>
                    <option value="Serie A">Serie A</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label htmlFor="modal-edition">Edition Type *</label>
                  <select
                    id="modal-edition"
                    value={newProductForm.edition}
                    onChange={(e) => setNewProductForm({ ...newProductForm, edition: e.target.value as any })}
                    className={styles.modalSelect}
                  >
                    <option value="Fan Version">Fan Version</option>
                    <option value="Player Issue / Match Edition">Player Issue / Match Edition</option>
                    <option value="Retro Classic">Retro Classic</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label htmlFor="modal-category">Category *</label>
                  <select
                    id="modal-category"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className={styles.modalSelect}
                  >
                    <option value="club">Club Teams</option>
                    <option value="national">National Teams</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow3}>
                <div className={styles.formField}>
                  <label htmlFor="modal-price">Regular Price (৳) *</label>
                  <input
                    type="number"
                    id="modal-price"
                    required
                    min="100"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="modal-orig-price">Original Price (৳) *</label>
                  <input
                    type="number"
                    id="modal-orig-price"
                    required
                    min="100"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="modal-stock">Initial Warehouse Stock *</label>
                  <input
                    type="number"
                    id="modal-stock"
                    required
                    min="0"
                    value={newProductForm.stockCount}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stockCount: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              {/* Jersey Image Selector & File Uploader */}
              <div className={styles.imageSelectorBox}>
                <div className={styles.imageSelectorHeader}>
                  <label className={styles.fieldLabel}>JERSEY PRODUCT IMAGE *</label>
                  <span className={styles.imageHelpText}>Select preset, enter image path / URL, or upload from device</span>
                </div>

                <div className={styles.imageConfigRow}>
                  {/* Live Preview Thumbnail */}
                  <div className={styles.imagePreviewWrap}>
                    {newProductForm.image ? (
                      <img
                        src={newProductForm.image}
                        alt="Jersey Preview"
                        className={styles.imagePreviewThumb}
                      />
                    ) : (
                      <div className={styles.imagePreviewPlaceholder}>
                        <PackageIcon size={24} />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.imageControlsColumn}>
                    {/* Quick Presets */}
                    <div className={styles.presetButtonsRow}>
                      {JERSEY_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          className={`${styles.presetBtn} ${newProductForm.image === preset.url ? styles.presetBtnActive : ""}`}
                          onClick={() => setNewProductForm({ ...newProductForm, image: preset.url })}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual URL or File Upload */}
                    <div className={styles.imageInputsRow}>
                      <input
                        type="text"
                        placeholder="Image Path or URL (e.g. /images/brazil_kit.jpg)"
                        value={newProductForm.image}
                        onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                        className={styles.modalInput}
                      />
                      <label className={styles.fileUploadBtn}>
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                if (uploadEvent.target?.result) {
                                  setNewProductForm({
                                    ...newProductForm,
                                    image: uploadEvent.target.result as string,
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="modal-desc">Fabric &amp; Specifications Description</label>
                <textarea
                  id="modal-desc"
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className={styles.modalTextarea}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Publish Kit to Live Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: EDIT JERSEY PRODUCT (UPDATE CRUD)
         ========================================================= */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={() => setEditingProduct(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <EditIcon size={20} />
                <h3>Edit Jersey Details: {editingProduct.name}</h3>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setEditingProduct(null)}
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className={styles.modalForm}>
              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="edit-name">Jersey Title *</label>
                  <input
                    type="text"
                    id="edit-name"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="edit-team">Team / Club *</label>
                  <input
                    type="text"
                    id="edit-team"
                    required
                    value={editingProduct.team}
                    onChange={(e) => setEditingProduct({ ...editingProduct, team: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.formRow3}>
                <div className={styles.formField}>
                  <label htmlFor="edit-price">Price (৳) *</label>
                  <input
                    type="number"
                    id="edit-price"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="edit-stock">Warehouse Stock *</label>
                  <input
                    type="number"
                    id="edit-stock"
                    required
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="edit-edition">Edition *</label>
                  <select
                    id="edit-edition"
                    value={editingProduct.edition}
                    onChange={(e) => setEditingProduct({ ...editingProduct, edition: e.target.value as any })}
                    className={styles.modalSelect}
                  >
                    <option value="Fan Version">Fan Version</option>
                    <option value="Player Issue / Match Edition">Player Issue / Match Edition</option>
                    <option value="Retro Classic">Retro Classic</option>
                  </select>
                </div>
              </div>

              {/* Edit Image Selector & File Uploader */}
              <div className={styles.imageSelectorBox}>
                <div className={styles.imageSelectorHeader}>
                  <label className={styles.fieldLabel}>JERSEY PRODUCT IMAGE *</label>
                  <span className={styles.imageHelpText}>Select preset, enter image path / URL, or upload from device</span>
                </div>

                <div className={styles.imageConfigRow}>
                  {/* Live Preview Thumbnail */}
                  <div className={styles.imagePreviewWrap}>
                    {editingProduct.images?.[0] ? (
                      <img
                        src={editingProduct.images[0]}
                        alt="Jersey Preview"
                        className={styles.imagePreviewThumb}
                      />
                    ) : (
                      <div className={styles.imagePreviewPlaceholder}>
                        <PackageIcon size={24} />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.imageControlsColumn}>
                    {/* Quick Presets */}
                    <div className={styles.presetButtonsRow}>
                      {JERSEY_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          className={`${styles.presetBtn} ${editingProduct.images?.[0] === preset.url ? styles.presetBtnActive : ""}`}
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              images: [preset.url],
                            })
                          }
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual URL or File Upload */}
                    <div className={styles.imageInputsRow}>
                      <input
                        type="text"
                        placeholder="Image Path or URL (e.g. /images/brazil_kit.jpg)"
                        value={editingProduct.images?.[0] || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [e.target.value],
                          })
                        }
                        className={styles.modalInput}
                      />
                      <label className={styles.fileUploadBtn}>
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                if (uploadEvent.target?.result) {
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: [uploadEvent.target.result as string],
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: CREATE VOUCHER CODE
         ========================================================= */}
      {isAddVoucherOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddVoucherOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <TagIcon size={20} />
                <h3>Create New Promo Voucher Code</h3>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsAddVoucherOpen(false)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className={styles.modalForm}>
              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="vch-code">Promo Code *</label>
                  <input
                    type="text"
                    id="vch-code"
                    required
                    placeholder="e.g. BANGLADESH2026"
                    value={newVoucherForm.code}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, code: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="vch-type">Discount Type *</label>
                  <select
                    id="vch-type"
                    value={newVoucherForm.type}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, type: e.target.value as any })}
                    className={styles.modalSelect}
                  >
                    <option value="percentage">Percentage Discount (% OFF)</option>
                    <option value="flat">Flat Amount Discount (৳ OFF)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="vch-val">Discount Value (% or ৳) *</label>
                  <input
                    type="number"
                    id="vch-val"
                    required
                    min="1"
                    value={newVoucherForm.value}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, value: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="vch-min">Minimum Cart Spend (৳) *</label>
                  <input
                    type="number"
                    id="vch-min"
                    required
                    min="0"
                    value={newVoucherForm.minSpend}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, minSpend: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddVoucherOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Activate Promo Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: MANUAL PHONE ORDER
         ========================================================= */}
      {isManualOrderOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsManualOrderOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <PhoneIcon size={20} />
                <h3>Create Manual / Phone Tournament Order</h3>
              </div>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsManualOrderOpen(false)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className={styles.modalForm}>
              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="ord-cust">Customer Name *</label>
                  <input
                    type="text"
                    id="ord-cust"
                    required
                    placeholder="e.g. Mahfuz Alam"
                    value={manualOrderForm.customerName}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerName: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="ord-phone">Customer Phone Number *</label>
                  <input
                    type="tel"
                    id="ord-phone"
                    required
                    placeholder="01XXXXXXXXX"
                    value={manualOrderForm.phone}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="ord-addr">Delivery Address *</label>
                <input
                  type="text"
                  id="ord-addr"
                  required
                  placeholder="House, Road, Area, City"
                  value={manualOrderForm.address}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                  className={styles.modalInput}
                />
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="ord-items">Ordered Kit(s) *</label>
                  <input
                    type="text"
                    id="ord-items"
                    required
                    value={manualOrderForm.items}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, items: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="ord-custom">Heat-Press Customization</label>
                  <input
                    type="text"
                    id="ord-custom"
                    placeholder="Name: SQUAD | No: 10"
                    value={manualOrderForm.customDetail}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, customDetail: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formField}>
                  <label htmlFor="ord-tot">Total Payable (৳) *</label>
                  <input
                    type="number"
                    id="ord-tot"
                    required
                    value={manualOrderForm.total}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, total: Number(e.target.value) })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="ord-pm">Payment Method *</label>
                  <select
                    id="ord-pm"
                    value={manualOrderForm.paymentMethod}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value })}
                    className={styles.modalSelect}
                  >
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="bKash (Phone Verified)">bKash (Phone Verified)</option>
                    <option value="Nagad (Phone Verified)">Nagad (Phone Verified)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsManualOrderOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircleIcon size={16} />
                  <span>Submit Order to Production</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
