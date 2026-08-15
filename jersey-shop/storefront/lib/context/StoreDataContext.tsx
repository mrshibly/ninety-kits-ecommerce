"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_PRODUCTS, Product } from "@/lib/data/products";

export interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  customName?: string;
  customNumber?: string;
  team?: string;
}

export interface StoreOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  division: string;
  items: string;
  itemDetails: OrderItem[];
  customDetail?: string;
  total: number;
  paymentMethod: string;
  status: "Pending COD" | "Printing Queue" | "Quality Checked" | "Dispatched" | "Delivered";
  courier: string;
  trackingNumber?: string;
  date: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  minSpend: number;
  usageCount: number;
  isActive: boolean;
  expires: string;
}

export interface StoreSettings {
  shippingInsideDhaka: number;
  shippingOutsideDhaka: number;
  freeShippingThreshold: number;
  customizationFee: number;
  storePhone?: string;
  supportEmail?: string;
  supportHelpline?: string;
  merchantBkashNumber?: string;
  merchantNagadNumber?: string;
  merchantRocketNumber?: string;
}

export interface HeroBannerConfig {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
}

const DEFAULT_HERO_BANNER: HeroBannerConfig = {
  image: "/images/hero_banner.jpg",
  badge: "NEW 2026/27 SEASON DROPS",
  title: "NEVER NOT MATCH READY",
  subtitle: "OFFICIAL 2026/27 CLUB & NATIONAL TEAM KITS",
};

const DEFAULT_SETTINGS: StoreSettings = {
  shippingInsideDhaka: 80,
  shippingOutsideDhaka: 130,
  freeShippingThreshold: 5000,
  customizationFee: 200,
  storePhone: "+880 1800-909090",
  supportEmail: "support@ninetykits.com",
  supportHelpline: "+880 1800-909090",
  merchantBkashNumber: "01800-909090",
  merchantNagadNumber: "01800-909090",
  merchantRocketNumber: "01800-909090",
};

const DEFAULT_ORDERS: StoreOrder[] = [
  {
    id: "NK-892410",
    customerName: "Tanvir Ahmed",
    phone: "01711223344",
    email: "customer@ninetykits.com",
    address: "House 12, Road 5, Sector 11, Uttara",
    district: "Dhaka",
    division: "Dhaka",
    items: "Brazil Home Kit 2026 (Size L)",
    itemDetails: [
      {
        name: "Brazil Home Kit 2026 World Edition",
        size: "L",
        quantity: 1,
        price: 1700,
        customName: "NEYMAR JR",
        customNumber: "10",
      },
    ],
    customDetail: "Name: NEYMAR JR | No: 10 (Official Font)",
    total: 1760,
    paymentMethod: "bKash (Verified)",
    status: "Printing Queue",
    courier: "Pathao Express",
    trackingNumber: "PTH-892410-BD",
    date: "14 Aug 2026",
  },
  {
    id: "NK-892411",
    customerName: "Sabbir Hossain",
    phone: "01819556677",
    address: "Mirpur 2, Block C",
    district: "Dhaka",
    division: "Dhaka",
    items: "Real Madrid Away Kit 2025/26 (Size M)",
    itemDetails: [
      {
        name: "Real Madrid Away Kit 2025/26",
        size: "M",
        quantity: 1,
        price: 2100,
        customName: "VINICIUS JR",
        customNumber: "7",
      },
    ],
    customDetail: "Name: VINICIUS JR | No: 7",
    total: 2160,
    paymentMethod: "Cash on Delivery",
    status: "Pending COD",
    courier: "Pathao Express",
    trackingNumber: "PTH-892411-BD",
    date: "14 Aug 2026",
  },
  {
    id: "NK-892412",
    customerName: "Fahim Shahriar",
    phone: "01912334455",
    address: "GEC Circle",
    district: "Chittagong",
    division: "Chittagong",
    items: "FC Barcelona Blaugrana Home Kit 2025/26 (Size XL)",
    itemDetails: [
      {
        name: "FC Barcelona Blaugrana Home Kit 2025/26",
        size: "XL",
        quantity: 1,
        price: 1900,
        customName: "YAMAL",
        customNumber: "19",
      },
    ],
    customDetail: "Name: YAMAL | No: 19",
    total: 2020,
    paymentMethod: "Nagad (Verified)",
    status: "Quality Checked",
    courier: "Steadfast Courier",
    trackingNumber: "STF-892412-BD",
    date: "12 Aug 2026",
  },
  {
    id: "NK-718290",
    customerName: "Tanvir Ahmed",
    phone: "01711223344",
    email: "customer@ninetykits.com",
    address: "House 12, Road 5, Sector 11, Uttara",
    district: "Dhaka",
    division: "Dhaka",
    items: "Argentina 3-Star World Champions Home Kit (Size M)",
    itemDetails: [
      {
        name: "Argentina 3-Star World Champions Home Kit",
        size: "M",
        quantity: 1,
        price: 1900,
        customName: "MESSI",
        customNumber: "10",
      },
    ],
    customDetail: "Name: MESSI | No: 10",
    total: 1960,
    paymentMethod: "bKash (Verified)",
    status: "Delivered",
    courier: "Pathao Express",
    trackingNumber: "PTH-718290-BD",
    date: "02 Aug 2026",
  },
];

const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: "vch-1",
    code: "KICKOFF10",
    type: "percentage",
    value: 10,
    minSpend: 1500,
    usageCount: 42,
    isActive: true,
    expires: "31 Dec 2026",
  },
  {
    id: "vch-2",
    code: "NINETY200",
    type: "flat",
    value: 200,
    minSpend: 2500,
    usageCount: 18,
    isActive: true,
    expires: "15 Oct 2026",
  },
  {
    id: "vch-3",
    code: "EID2026",
    type: "percentage",
    value: 15,
    minSpend: 3000,
    usageCount: 5,
    isActive: true,
    expires: "20 May 2027",
  },
];

interface StoreDataContextType {
  // Products CRUD
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  adjustProductStock: (productId: string, delta: number) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  addProductReview: (
    productId: string,
    review: { author: string; city: string; rating: number; comment: string; userId?: string }
  ) => void;
  updateProductReview: (
    productId: string,
    reviewId: string,
    updatedData: { rating: number; comment: string; author?: string; city?: string }
  ) => void;
  deleteProductReview: (productId: string, reviewId: string) => void;

  // Orders CRUD
  orders: StoreOrder[];
  createOrder: (orderData: Omit<StoreOrder, "id" | "date">) => StoreOrder;
  updateOrderStatus: (orderId: string, status: StoreOrder["status"], trackingNumber?: string) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => StoreOrder | undefined;

  // Vouchers CRUD
  vouchers: Voucher[];
  addVoucher: (voucherData: Omit<Voucher, "id" | "usageCount">) => Voucher;
  toggleVoucher: (voucherId: string) => void;
  deleteVoucher: (voucherId: string) => void;
  incrementVoucherUsage: (code: string) => void;
  validateVoucher: (code: string, subtotal: number) => { valid: boolean; discountAmount: number; message: string };

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Hero Banner Configuration
  heroBanner: HeroBannerConfig;
  updateHeroBanner: (newConfig: Partial<HeroBannerConfig>) => void;
}

const StoreDataContext = createContext<StoreDataContextType | null>(null);

export function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [orders, setOrders] = useState<StoreOrder[]>(DEFAULT_ORDERS);
  const [vouchers, setVouchers] = useState<Voucher[]>(DEFAULT_VOUCHERS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [heroBanner, setHeroBanner] = useState<HeroBannerConfig>(DEFAULT_HERO_BANNER);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("ninetykits_dyn_products");
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        // Merge with fresh verified sample images if matches standard catalog
        const synced = parsed.map((p) => {
          const sampleMatch = SAMPLE_PRODUCTS.find((sp) => sp.id === p.id);
          if (sampleMatch) {
            return { ...p, images: sampleMatch.images };
          }
          return p;
        });
        setProducts(synced);
      } else {
        setProducts(SAMPLE_PRODUCTS);
      }

      const storedOrders = localStorage.getItem("ninetykits_dyn_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedVouchers = localStorage.getItem("ninetykits_dyn_vouchers");
      if (storedVouchers) {
        setVouchers(JSON.parse(storedVouchers));
      }

      const storedSettings = localStorage.getItem("ninetykits_dyn_settings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      const storedHeroBanner = localStorage.getItem("ninetykits_dyn_hero_banner");
      if (storedHeroBanner) {
        setHeroBanner(JSON.parse(storedHeroBanner));
      }
    } catch (e) {
      console.error("Storage hydration error:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync back to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ninetykits_dyn_products", JSON.stringify(products));
    } catch (e) {}
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ninetykits_dyn_orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ninetykits_dyn_vouchers", JSON.stringify(vouchers));
    } catch (e) {}
  }, [vouchers, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ninetykits_dyn_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ninetykits_dyn_hero_banner", JSON.stringify(heroBanner));
    } catch (e) {}
  }, [heroBanner, isHydrated]);

  const updateHeroBanner = (newConfig: Partial<HeroBannerConfig>) => {
    setHeroBanner((prev) => ({ ...prev, ...newConfig }));
  };

  // --------------------------------------------------------------------------
  // PRODUCTS CRUD
  // --------------------------------------------------------------------------
  const addProduct = (productData: Omit<Product, "id">): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const adjustProductStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockCount: Math.max(0, p.stockCount + delta) } : p
      )
    );
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  const addProductReview = (
    productId: string,
    reviewData: {
      author: string;
      city: string;
      rating: number;
      comment: string;
    }
  ) => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewData.author.trim() || "Verified Supporter",
      city: reviewData.city.trim() || "Dhaka",
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment.trim(),
      verified: true,
      date: formattedDate,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        const currentReviews = p.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const avgRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Number(avgRating.toFixed(1)),
        };
      })
    );
  };

  const updateProductReview = (
    productId: string,
    reviewId: string,
    updatedData: {
      rating: number;
      comment: string;
      author?: string;
      city?: string;
    }
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        const currentReviews = p.reviews || [];
        const updatedReviews = currentReviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                rating: Number(updatedData.rating) || r.rating,
                comment: updatedData.comment.trim() || r.comment,
                ...(updatedData.author ? { author: updatedData.author.trim() } : {}),
                ...(updatedData.city ? { city: updatedData.city.trim() } : {}),
              }
            : r
        );
        const avgRating =
          updatedReviews.length > 0
            ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
            : 5.0;
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Number(avgRating.toFixed(1)),
        };
      })
    );
  };

  const deleteProductReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        const currentReviews = p.reviews || [];
        const updatedReviews = currentReviews.filter((r) => r.id !== reviewId);
        const avgRating =
          updatedReviews.length > 0
            ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
            : 5.0;
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Number(avgRating.toFixed(1)),
        };
      })
    );
  };

  // --------------------------------------------------------------------------
  // ORDERS CRUD
  // --------------------------------------------------------------------------
  const createOrder = (orderData: Omit<StoreOrder, "id" | "date">): StoreOrder => {
    const orderId = `NK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newOrder: StoreOrder = {
      ...orderData,
      id: orderId,
      date: formattedDate,
      trackingNumber: orderData.trackingNumber || `PTH-${orderId.replace("NK-", "")}-BD`,
    };

    // Auto-decrement inventory for purchased items
    if (orderData.itemDetails && orderData.itemDetails.length > 0) {
      orderData.itemDetails.forEach((item) => {
        const itemObj = item as any;
        if (itemObj.productId) {
          adjustProductStock(itemObj.productId, -(item.quantity || 1));
        } else {
          // If productId not explicitly stored, match product by name
          const matchedProd = products.find(
            (p) => p.name.toLowerCase() === item.name.toLowerCase()
          );
          if (matchedProd) {
            adjustProductStock(matchedProd.id, -(item.quantity || 1));
          }
        }
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: StoreOrder["status"],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
            }
          : ord
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const getOrderById = (query: string): StoreOrder | undefined => {
    if (!query) return undefined;
    const cleanQuery = query.trim().toLowerCase();
    const digitsQuery = cleanQuery.replace(/\D/g, "");

    return orders.find((o) => {
      const idMatch = o.id.toLowerCase() === cleanQuery;
      const trackingMatch =
        o.trackingNumber && o.trackingNumber.toLowerCase() === cleanQuery;
      const phoneMatch =
        digitsQuery.length >= 6 &&
        o.phone &&
        o.phone.replace(/\D/g, "").includes(digitsQuery);
      return idMatch || trackingMatch || phoneMatch;
    });
  };

  // --------------------------------------------------------------------------
  // VOUCHERS CRUD
  // --------------------------------------------------------------------------
  const addVoucher = (voucherData: Omit<Voucher, "id" | "usageCount">): Voucher => {
    const newVoucher: Voucher = {
      ...voucherData,
      id: `vch-${Date.now()}`,
      usageCount: 0,
    };
    setVouchers((prev) => [newVoucher, ...prev]);
    return newVoucher;
  };

  const toggleVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const deleteVoucher = (voucherId: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
  };

  const incrementVoucherUsage = (code: string) => {
    if (!code) return;
    setVouchers((prev) =>
      prev.map((v) =>
        v.code.toLowerCase() === code.trim().toLowerCase()
          ? { ...v, usageCount: (v.usageCount || 0) + 1 }
          : v
      )
    );
  };

  const validateVoucher = (
    code: string,
    subtotal: number
  ): { valid: boolean; discountAmount: number; message: string } => {
    const voucher = vouchers.find(
      (v) => v.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (!voucher) {
      return { valid: false, discountAmount: 0, message: "Invalid voucher code" };
    }

    if (!voucher.isActive) {
      return { valid: false, discountAmount: 0, message: "This voucher has expired or is inactive" };
    }

    if (subtotal < voucher.minSpend) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order amount of ৳${voucher.minSpend.toLocaleString()} required`,
      };
    }

    let discountAmount = 0;
    if (voucher.type === "percentage") {
      discountAmount = Math.round((subtotal * voucher.value) / 100);
    } else {
      discountAmount = voucher.value;
    }

    return {
      valid: true,
      discountAmount,
      message: `Voucher applied: ${voucher.type === "percentage" ? `${voucher.value}% OFF` : `৳${voucher.value} OFF`}`,
    };
  };

  // --------------------------------------------------------------------------
  // STORE SETTINGS
  // --------------------------------------------------------------------------
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,
        getProductBySlug,
        addProductReview,
        updateProductReview,
        deleteProductReview,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        vouchers,
        addVoucher,
        toggleVoucher,
        deleteVoucher,
        incrementVoucherUsage,
        validateVoucher,
        settings,
        updateSettings,
        heroBanner,
        updateHeroBanner,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
}

export function useStoreData() {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
}
