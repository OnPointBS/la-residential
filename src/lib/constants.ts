export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Floor Plans", href: "/floor-plans" },
  { name: "Homes for Sale", href: "/homes" },
  { name: "Contact Us", href: "/contact" },
];

export const HOME_STATUSES = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "under-construction", label: "Under Construction", color: "bg-yellow-500" },
  { value: "sold", label: "Sold", color: "bg-red-500" },
  { value: "coming-soon", label: "Coming Soon", color: "bg-blue-500" },
] as const;

export const FEATURES = [
  "Energy Efficient",
  "Smart Home Ready",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Hardwood Floors",
  "Walk-in Closets",
  "Double Pane Windows",
  "Central Air Conditioning",
  "Attached Garage",
  "Landscaped Yard",
] as const;

export const ADMIN_NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { name: "Homes", href: "/admin/homes", icon: "Home" },
  { name: "Floor Plans", href: "/admin/floor-plans", icon: "Blueprint" },
  { name: "Images", href: "/admin/images", icon: "Image" },
  { name: "Inquiries", href: "/admin/inquiries", icon: "Mail" },
  { name: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const IMAGE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxDimensions: { width: 4096, height: 4096 },
} as const;
