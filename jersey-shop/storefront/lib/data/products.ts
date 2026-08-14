// Production Mock Catalog Data for NINETY KITS
// Structured for seamless mapping with Saleor GraphQL Product Schema

export interface ProductSpecification {
  fabric: string;
  fit: string;
  technology: string;
  care: string;
  origin: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  city: string;
}

export interface Product {
  id: string;
  name: string;
  bnName?: string;
  slug: string;
  description: string;
  bnDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  team: string;
  league: string;
  category: "club" | "national" | "retro" | "special";
  edition: "Fan Version" | "Player Issue / Match Edition";
  isCustomizable: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  sizes: string[];
  colors: string[];
  specs: ProductSpecification;
  reviews: ProductReview[];
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Brazil Home Kit 2026 World Edition",
    bnName: "ব্রাজিল হোম জার্সি ২০২৬",
    slug: "brazil-home-jersey-2026",
    description:
      "The iconic Seleção canary yellow jersey engineered with breathable micro-mesh fabric. Features green collar trim, authentic CBF crest detailing, and heat-press custom name printing.",
    bnDescription:
      "হলুদ ও সবুজ ট্রিমের ব্রাজিল হোম জার্সি। প্রিমিয়াম ব্রিদেবল ফেব্রিক ও কাস্টম নাম প্রিন্টিং সুবিধা।",
    price: 1500,
    originalPrice: 1850,
    currency: "৳",
    images: [
      "/images/brazil_kit.jpg",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Brazil",
    league: "International",
    category: "national",
    edition: "Fan Version",
    isCustomizable: true,
    inStock: true,
    stockCount: 42,
    rating: 4.9,
    reviewCount: 128,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Canary Yellow", "Amazon Green"],
    specs: {
      fabric: "100% Recycled Poly-Mesh",
      fit: "Regular Athletic Fit",
      technology: "Dri-FIT Breathable",
      care: "Machine wash cold inside out",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-1",
        author: "Tanvir Ahmed",
        rating: 5,
        date: "2 days ago",
        comment: "The print quality for VINICIUS JR 7 is crisp and high quality! Delivered in Dhaka in just 24 hours.",
        verified: true,
        city: "Dhaka",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Real Madrid Away Kit 2025/26",
    bnName: "রিয়াল মাদ্রিদ অ্যাওয়ে কিট ২০২৫/২৬",
    slug: "real-madrid-away-jersey-2026",
    description:
      "Sleek royal navy silhouette accented with metallic gold crest highlights. Match-day edition woven for optimum airflow and active comfort.",
    bnDescription:
      "রয়্যাল নেভি ব্লু ও গোল্ডেন এক্সেন্টের রিয়াল মাদ্রিদ অ্যাওয়ে কিট। আধুনিক অ্যাথলেটিক ফিট।",
    price: 1800,
    originalPrice: 2100,
    currency: "৳",
    images: [
      "/images/real_madrid_kit.jpg",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Real Madrid",
    league: "La Liga",
    category: "club",
    edition: "Player Issue / Match Edition",
    isCustomizable: true,
    inStock: true,
    stockCount: 28,
    rating: 4.95,
    reviewCount: 94,
    badge: "Match Edition",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Deep Navy", "Metallic Gold"],
    specs: {
      fabric: "100% AEROREADY Doubleknit",
      fit: "Slim Player Fit",
      technology: "HEAT.RDY Ventilated Core",
      care: "Gentle wash cold, air dry",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-3",
        author: "Sabbir Hossain",
        rating: 5,
        date: "3 days ago",
        comment: "BELLINGHAM 5 custom print is top notch! Feels like the authentic official kit.",
        verified: true,
        city: "Sylhet",
      },
    ],
  },
  {
    id: "prod-3",
    name: "FC Barcelona Blaugrana Home Kit 2025/26",
    bnName: "এফসি বার্সেলোনা হোম কিট ২০২৫/২৬",
    slug: "barcelona-home-jersey-2026",
    description:
      "Timeless heritage vertical Blaugrana bands with gold accents and high-definition silicone club emblem.",
    bnDescription:
      "ঐতিহ্যবাহী ব্লাউগ্রানা স্ট্রাইপ ও আধুনিক কাটের বার্সা হোম জার্সি। ১০০% আরামদায়ক ফেব্রিক।",
    price: 1700,
    originalPrice: 2000,
    currency: "৳",
    images: [
      "/images/barcelona_kit.jpg",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
    ],
    team: "FC Barcelona",
    league: "La Liga",
    category: "club",
    edition: "Fan Version",
    isCustomizable: true,
    inStock: true,
    stockCount: 35,
    rating: 4.88,
    reviewCount: 112,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Deep Royal", "Noble Red"],
    specs: {
      fabric: "100% Recycled Polyester",
      fit: "Standard Supporter Fit",
      technology: "Dri-FIT ADV",
      care: "Cold wash, do not bleach",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-4",
        author: "Fahim Shahriar",
        rating: 5,
        date: "5 days ago",
        comment: "Customized with LAMINE YAMAL 19. The heat seal print doesn't peel at all.",
        verified: true,
        city: "Dhaka",
      },
    ],
  },
  {
    id: "prod-4",
    name: "Manchester United Red Devils Home Kit",
    bnName: "ম্যানচেস্টার ইউনাইটেড হোম কিট",
    slug: "manchester-united-home-jersey-2026",
    description:
      "Dominant scarlet red with geometric gradient underlays and classic sharp collar styling.",
    bnDescription:
      "ঐতিহাসিক ম্যানচেস্টার ইউনাইটেড হোম জার্সি। প্রিমিয়াম পলিয়েস্টার ও নিখুঁত ফিনিশিং।",
    price: 1600,
    originalPrice: 1900,
    currency: "৳",
    images: [
      "/images/man_united_kit.jpg",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Manchester United",
    league: "Premier League",
    category: "club",
    edition: "Fan Version",
    isCustomizable: true,
    inStock: true,
    stockCount: 50,
    rating: 4.82,
    reviewCount: 76,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Scarlet Red", "Core Black"],
    specs: {
      fabric: "100% Hydrophilic Polyester",
      fit: "Regular Cut",
      technology: "AEROREADY Comfort System",
      care: "Wash inside out",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-5",
        author: "Mehedi Hasan",
        rating: 5,
        date: "1 week ago",
        comment: "Brilliant jersey. Best shop in BD for football kits.",
        verified: true,
        city: "Rajshahi",
      },
    ],
  },
  {
    id: "prod-5",
    name: "Bangladesh National Team Official Kit",
    bnName: "বাংলাদেশ জাতীয় দল অফিসিয়াল কিট",
    slug: "bangladesh-national-team-jersey",
    description:
      "National pride jersey featuring vibrant emerald green with the crimson disc emblem on chest, accented by cultural geometric sleeve motifs.",
    bnDescription:
      "লাল-সবুজের গর্বিত বাংলাদেশ জাতীয় দল জার্সি। উচ্চমানের সফট কাপড়ে তৈরি।",
    price: 1200,
    originalPrice: 1500,
    currency: "৳",
    images: [
      "/images/bangladesh_kit.jpg",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Bangladesh",
    league: "International",
    category: "national",
    edition: "Fan Version",
    isCustomizable: true,
    inStock: true,
    stockCount: 65,
    rating: 4.97,
    reviewCount: 210,
    badge: "National Pride",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Bengal Emerald", "Crimson Red"],
    specs: {
      fabric: "100% Quick-Dry Sports Polyester",
      fit: "Comfort Fit",
      technology: "Air-Flow Moisture Management",
      care: "Machine wash cold",
      origin: "Official BD Edition",
    },
    reviews: [
      {
        id: "rev-6",
        author: "Imtiaz Rahman",
        rating: 5,
        date: "Yesterday",
        comment: "Very proud to wear this! Custom name printing looks awesome.",
        verified: true,
        city: "Dhaka",
      },
    ],
  },
  {
    id: "prod-6",
    name: "Argentina 3-Star World Champions Home Kit",
    bnName: "আর্জেন্টিনা ৩-স্টার ওয়ার্ল্ড চ্যাম্পিয়নস কিট",
    slug: "argentina-home-jersey-2026",
    description:
      "The prestigious Albiceleste sky blue & white stripes complete with 3 gold embroidered stars and FIFA World Champions central crest.",
    bnDescription:
      "তিন তারকা খচিত বিশ্বকাপ চ্যাম্পিয়ন আর্জেন্টিনা হোম জার্সি। গোল্ডেন এক্সেন্ট।",
    price: 1700,
    originalPrice: 2000,
    currency: "৳",
    images: [
      "/images/argentina_kit.jpg",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Argentina",
    league: "International",
    category: "national",
    edition: "Player Issue / Match Edition",
    isCustomizable: true,
    inStock: true,
    stockCount: 55,
    rating: 4.98,
    reviewCount: 310,
    badge: "Champions Edition",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Sky Blue", "Clean White"],
    specs: {
      fabric: "100% Recycled Polyester Jacquard",
      fit: "Athletic Match Cut",
      technology: "HEAT.RDY Ventilation",
      care: "Gentle wash cold, hang dry",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-7",
        author: "Arafat Hossain",
        rating: 5,
        date: "4 days ago",
        comment: "MESSI 10 print with the gold World Cup badge is absolute perfection!",
        verified: true,
        city: "Khulna",
      },
    ],
  },
  {
    id: "prod-7",
    name: "Liverpool FC Anfield Home Kit 2025/26",
    bnName: "লিভারপুল এফসি অ্যানফিল্ড হোম কিট ২০২৫/২৬",
    slug: "liverpool-home-jersey-2026",
    description:
      "Vibrant Anfield scarlet red complete with gold Liverbird crest and yellow heritage pinstripe accents.",
    bnDescription:
      "অ্যানফিল্ড রেড ও গোল্ডেন লিভারবার্ড খচিত লিভারপুল হোম কিট।",
    price: 1600,
    originalPrice: 1900,
    currency: "৳",
    images: [
      "/images/liverpool_kit.jpg",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Liverpool",
    league: "Premier League",
    category: "club",
    edition: "Fan Version",
    isCustomizable: true,
    inStock: true,
    stockCount: 40,
    rating: 4.85,
    reviewCount: 88,
    badge: "Hot Pick",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Anfield Red", "Yellow Pinstripe"],
    specs: {
      fabric: "100% Breathable Poly-Mesh",
      fit: "Standard Supporter Fit",
      technology: "Dri-FIT Moisture Control",
      care: "Wash inside out",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-8",
        author: "Shafiqul Islam",
        rating: 5,
        date: "3 days ago",
        comment: "SALAH 11 custom print looks brilliant on this kit!",
        verified: true,
        city: "Chittagong",
      },
    ],
  },
  {
    id: "prod-8",
    name: "Paris Saint-Germain Third Kit 2025/26",
    bnName: "প্যারিস সেন্ট-জার্মেই থার্ড কিট ২০২৫/২৬",
    slug: "psg-third-jersey-2026",
    description:
      "Modern luxury graphite and deep charcoal base paired with radiant infrared pink accents and the iconic PSG crest.",
    bnDescription:
      "মডার্ন গ্রাফাইট ও ইনফ্রারেড পিঙ্ক এক্সেন্টের পিএসজি থার্ড কিট।",
    price: 1800,
    originalPrice: 2150,
    currency: "৳",
    images: [
      "/images/psg_kit.jpg",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
    ],
    team: "Paris Saint-Germain",
    league: "Ligue 1",
    category: "club",
    edition: "Player Issue / Match Edition",
    isCustomizable: true,
    inStock: true,
    stockCount: 30,
    rating: 4.9,
    reviewCount: 64,
    badge: "Special Edition",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Graphite Charcoal", "Infrared Pink"],
    specs: {
      fabric: "100% AEROREADY Jacquard",
      fit: "Athletic Match Cut",
      technology: "HEAT.RDY Advanced Airflow",
      care: "Machine wash cold",
      origin: "Master Grade",
    },
    reviews: [
      {
        id: "rev-9",
        author: "Naimul Haque",
        rating: 5,
        date: "5 days ago",
        comment: "DEMBELE 10 print looks so stylish with this charcoal black background.",
        verified: true,
        city: "Dhaka",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return SAMPLE_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByLeague(league: string): Product[] {
  return SAMPLE_PRODUCTS.filter(
    (p) => p.league.toLowerCase() === league.toLowerCase()
  );
}

export function getProductsByCategory(category: string): Product[] {
  return SAMPLE_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(count: number = 4): Product[] {
  return SAMPLE_PRODUCTS.slice(0, count);
}
