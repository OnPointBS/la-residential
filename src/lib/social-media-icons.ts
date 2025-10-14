import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Github, 
  Link,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Star,
  Users,
  Building,
  Home,
  Calendar,
  Clock,
  MapPin,
  Search,
  Settings,
  User,
  Zap
} from "lucide-react";

export interface SocialMediaIcon {
  name: string;
  label: string;
  component: any;
  color: string;
  popular: boolean;
}

export const SOCIAL_MEDIA_ICONS: SocialMediaIcon[] = [
  // Popular Social Media Platforms
  {
    name: "facebook",
    label: "Facebook",
    component: Facebook,
    color: "#1877F2",
    popular: true,
  },
  {
    name: "instagram",
    label: "Instagram",
    component: Instagram,
    color: "#E4405F",
    popular: true,
  },
  {
    name: "youtube",
    label: "YouTube",
    component: Youtube,
    color: "#FF0000",
    popular: true,
  },
  {
    name: "twitter",
    label: "Twitter/X",
    component: Twitter,
    color: "#1DA1F2",
    popular: true,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    component: Linkedin,
    color: "#0A66C2",
    popular: true,
  },
  {
    name: "github",
    label: "GitHub",
    component: Github,
    color: "#181717",
    popular: true,
  },

  // Generic Icons
  {
    name: "link",
    label: "Custom Link",
    component: Link,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "globe",
    label: "Website",
    component: Globe,
    color: "#10B981",
    popular: false,
  },
  {
    name: "mail",
    label: "Email",
    component: Mail,
    color: "#EF4444",
    popular: false,
  },
  {
    name: "phone",
    label: "Phone",
    component: Phone,
    color: "#8B5CF6",
    popular: false,
  },
  {
    name: "message",
    label: "Message",
    component: MessageCircle,
    color: "#F59E0B",
    popular: false,
  },
  {
    name: "share",
    label: "Share",
    component: Share2,
    color: "#6366F1",
    popular: false,
  },
  {
    name: "heart",
    label: "Heart",
    component: Heart,
    color: "#EC4899",
    popular: false,
  },
  {
    name: "star",
    label: "Star",
    component: Star,
    color: "#F59E0B",
    popular: false,
  },
  {
    name: "users",
    label: "Users",
    component: Users,
    color: "#10B981",
    popular: false,
  },
  {
    name: "building",
    label: "Building",
    component: Building,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "home",
    label: "Home",
    component: Home,
    color: "#8B5CF6",
    popular: false,
  },
  {
    name: "calendar",
    label: "Calendar",
    component: Calendar,
    color: "#EF4444",
    popular: false,
  },
  {
    name: "clock",
    label: "Clock",
    component: Clock,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "map",
    label: "Map",
    component: MapPin,
    color: "#EF4444",
    popular: false,
  },
  {
    name: "search",
    label: "Search",
    component: Search,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "settings",
    label: "Settings",
    component: Settings,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "user",
    label: "User",
    component: User,
    color: "#6B7280",
    popular: false,
  },
  {
    name: "zap",
    label: "Zap",
    component: Zap,
    color: "#F59E0B",
    popular: false,
  },
];

export function getIconByName(name: string): SocialMediaIcon | undefined {
  return SOCIAL_MEDIA_ICONS.find(icon => icon.name === name);
}

export function getPopularIcons(): SocialMediaIcon[] {
  return SOCIAL_MEDIA_ICONS.filter(icon => icon.popular);
}

export function getIconByCategory(category: 'social' | 'professional' | 'generic'): SocialMediaIcon[] {
  const categories = {
    social: ['facebook', 'instagram', 'youtube', 'twitter', 'linkedin', 'github'],
    professional: ['linkedin', 'github'],
    generic: ['link', 'globe', 'mail', 'phone', 'message', 'share', 'heart', 'star', 'users', 'building', 'home', 'calendar', 'clock', 'map', 'search', 'settings', 'user', 'zap']
  };

  return SOCIAL_MEDIA_ICONS.filter(icon => categories[category].includes(icon.name));
}

export function getIconComponent(name: string) {
  const icon = getIconByName(name);
  return icon ? icon.component : Link;
}

export function getIconColor(name: string) {
  const icon = getIconByName(name);
  return icon ? icon.color : '#6B7280';
}
