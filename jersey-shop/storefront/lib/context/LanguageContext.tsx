"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

export interface Translations {
  // Top Banner
  freeShippingBanner: string;
  authenticGuarantee: string;
  trackOrder: string;
  customerHelp: string;

  // Nav
  shop: string;
  allJerseys: string;
  premierLeague: string;
  laLiga: string;
  serieA: string;
  nationalTeams: string;
  customize: string;
  teamOrders: string;
  about: string;
  searchPlaceholder: string;
  cart: string;
  wishlist: string;

  // Hero
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  heroSubheadline: string;
  shopNow: string;
  customizeKit: string;
  trustDelivery: string;
  trustCustom: string;
  trustPayments: string;
  trustAuthentic: string;

  // Products & Cards
  featuredJerseys: string;
  viewAll: string;
  customizableBadge: string;
  discountOff: string;
  addToCart: string;
  addedToCart: string;
  viewDetails: string;
  quickView: string;
  selectSize: string;
  sizeGuide: string;
  inStock: string;
  outOfStock: string;
  currencySymbol: string;

  // Customizer
  addNameNumber: string;
  jerseyNameLabel: string;
  jerseyNumberLabel: string;
  printingStyle: string;
  officialFont: string;
  classicFont: string;
  previewNote: string;

  // Cart & Checkout
  shoppingCart: string;
  emptyCartTitle: string;
  emptyCartDesc: string;
  subtotal: string;
  shipping: string;
  free: string;
  total: string;
  proceedToCheckout: string;
  deliveryInfo: string;
  paymentMethod: string;
  reviewOrder: string;
  placeOrder: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
}

const translations: Record<Language, Translations> = {
  en: {
    freeShippingBanner: "Free delivery all over Bangladesh on orders over ৳5,000",
    authenticGuarantee: "Top quality fabric • 7-day easy exchange",
    trackOrder: "Track Order",
    customerHelp: "Helpline: +880 1800-909090",

    shop: "Shop",
    allJerseys: "All Jerseys",
    premierLeague: "Premier League",
    laLiga: "La Liga",
    serieA: "Serie A",
    nationalTeams: "National Teams",
    customize: "Custom Print",
    teamOrders: "Team Orders",
    about: "About Us",
    searchPlaceholder: "Search jerseys, teams, or players (e.g. Real Madrid, Messi)...",
    cart: "Cart",
    wishlist: "Wishlist",

    heroBadge: "New 2026/27 Season Kits",
    heroHeadline1: "Wear Your",
    heroHeadline2: "Passion.",
    heroHeadline3: "Own Your Kit.",
    heroSubheadline: "Get your favorite club and country jerseys delivered anywhere in Bangladesh. Add your custom name & number, or order matching kits for your whole team.",
    shopNow: "Shop All Jerseys",
    customizeKit: "Custom Name & Number",
    trustDelivery: "Fast Delivery in 64 Districts",
    trustCustom: "Permanent Heat-Press Printing",
    trustPayments: "bKash, Nagad, Card or Cash on Delivery",
    trustAuthentic: "Comfortable Breathable Fabric",

    featuredJerseys: "Popular Jerseys",
    viewAll: "View All",
    customizableBadge: "Custom Name",
    discountOff: "OFF",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart!",
    viewDetails: "View Details",
    quickView: "Quick View",
    selectSize: "Choose Size",
    sizeGuide: "Size Chart",
    inStock: "In Stock",
    outOfStock: "Sold Out",
    currencySymbol: "৳",

    addNameNumber: "Print Custom Name & Number (+৳200)",
    jerseyNameLabel: "Name on Back (e.g. TANVIR)",
    jerseyNumberLabel: "Number (0 to 99)",
    printingStyle: "Font Style",
    officialFont: "Official League Font",
    classicFont: "Classic Block Font",
    previewNote: "Live preview of your custom jersey",

    shoppingCart: "Your Shopping Bag",
    emptyCartTitle: "Your Bag is Empty",
    emptyCartDesc: "Looks like you haven't picked a jersey yet. Check out our latest kits and find your fit.",
    subtotal: "Subtotal",
    shipping: "Delivery Fee",
    free: "FREE",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    deliveryInfo: "Delivery Details",
    paymentMethod: "Payment Method",
    reviewOrder: "Review Your Order",
    placeOrder: "Place Order",
    orderSuccessTitle: "Order Received!",
    orderSuccessDesc: "Thank you for your order! We will prepare your kit and send you an SMS with the tracking link.",
  },
  bn: {
    freeShippingBanner: "৳৫,০০০ এর বেশি অর্ডারে সারা দেশে ফ্রি ডেলিভারি",
    authenticGuarantee: "১০০% প্রিমিয়াম কোয়ালিটি ও ভেরিফাইড ফেব্রিক",
    trackOrder: "অর্ডার ট্র্যাক",
    customerHelp: "হটলাইন: +৮৮০ ১৮০০-৯০৯০৯০",

    shop: "শপ",
    allJerseys: "সব জার্সি",
    premierLeague: "প্রিমিয়ার লিগ",
    laLiga: "লা লিগা",
    serieA: "সিরি আ",
    nationalTeams: "জাতীয় দল",
    customize: "কাস্টমাইজার",
    teamOrders: "টিম অর্ডার",
    about: "আমাদের সম্পর্কে",
    searchPlaceholder: "জার্সি, টিম বা প্লেয়ার খুঁজুন (যেমন: রিয়াল মাদ্রিদ, মেসি)...",
    cart: "কার্ট",
    wishlist: "উইশলিস্ট",

    heroBadge: "অফিশিয়াল রেপ্লিকা ও ম্যাচ এডিশন কিটস",
    heroHeadline1: "আপনার ভালোবাসার জার্সি,",
    heroHeadline2: "গর্বের সাথে",
    heroHeadline3: "পরুন।",
    heroSubheadline: "প্রিমিয়াম কোয়ালিটি স্পোর্টস জার্সি ও টুর্নামেন্ট গ্রেড কাস্টম নাম-নাম্বার প্রিন্টিং। সারা বাংলাদেশের ৬৪ জেলায় দ্রুত ডেলিভারি সুবিধা।",
    shopNow: "সব জার্সি দেখুন",
    customizeKit: "কাস্টম প্রিন্টিং স্টুডিও",
    trustDelivery: "সারা দেশে দ্রুত ডেলিভারি",
    trustCustom: "টুর্নামেন্ট হিট প্রেস প্রিন্টিং",
    trustPayments: "বিকাশ / নগদ / কার্ড / ক্যাশ অন ডেলিভারি",
    trustAuthentic: "ব্রিদেবল প্রিমিয়াম ফেব্রিক",

    featuredJerseys: "জনপ্রিয় জার্সিসমূহ",
    viewAll: "সবগুলো দেখুন",
    customizableBadge: "কাস্টমাইজেবল",
    discountOff: "ছাড়",
    addToCart: "কার্টে যোগ করুন",
    addedToCart: "কার্টে যোগ হয়েছে!",
    viewDetails: "বিস্তারিত দেখুন",
    quickView: "একনজরে দেখুন",
    selectSize: "সাইজ নির্বাচন করুন",
    sizeGuide: "সাইজ গাইড",
    inStock: "স্টকে আছে - ২৪ ঘণ্টায় ডিসপ্যাচ",
    outOfStock: "স্টক শেষ",
    currencySymbol: "৳",

    addNameNumber: "কাস্টম নাম ও নম্বর যোগ করুন (+৳২০০)",
    jerseyNameLabel: "জার্সির পেছনের নাম",
    jerseyNumberLabel: "জার্সি নম্বর (০-৯৯)",
    printingStyle: "প্রিন্টিং স্টাইল",
    officialFont: "অফিশিয়াল লিগ ফন্ট",
    classicFont: "ক্লাসিক ব্লক ফন্ট",
    previewNote: "নিচে রিয়েল-টাইম প্রিভিউ দেখুন",

    shoppingCart: "শপিং কার্ট",
    emptyCartTitle: "আপনার কার্ট খালি",
    emptyCartDesc: "আমাদের জার্সি কালেকশন থেকে আপনার পছন্দের কিটটি বেছে নিন।",
    subtotal: "সাবটোটাল",
    shipping: "ডেলিভারি চার্জ",
    free: "ফ্রি",
    total: "মোট মূল্য",
    proceedToCheckout: "চেকআউট করুন",
    deliveryInfo: "ডেলিভারি ঠিকানা",
    paymentMethod: "পেমেন্ট মাধ্যম",
    reviewOrder: "অর্ডার যাচাই",
    placeOrder: "অর্ডার নিশ্চিত করুন",
    orderSuccessTitle: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে!",
    orderSuccessDesc: "আপনার অর্ডারটি গৃহীত হয়েছে। ৩০ মিনিটের মধ্যে এসএমএস/কলের মাধ্যমে নিশ্চিত করা হবে।",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ninetykits_lang") as Language;
    if (saved && (saved === "en" || saved === "bn")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ninetykits_lang", lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
