// Analytics utility functions

export interface AnalyticsData {
  pagePath: string;
  pageTitle: string;
  pageType: 'home' | 'floor-plan' | 'about' | 'contact' | 'homes-list' | 'floor-plans-list' | 'homepage';
  homeId?: string;
  floorPlanId?: string;
  referrer?: string;
  userAgent?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  sessionId?: string;
}

// Detect device type from user agent
export function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase();
  
  if (/tablet|ipad|playbook|silk/.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

// Detect browser from user agent
export function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    return 'Chrome';
  }
  if (ua.includes('firefox')) {
    return 'Firefox';
  }
  if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'Safari';
  }
  if (ua.includes('edg')) {
    return 'Edge';
  }
  if (ua.includes('opera') || ua.includes('opr')) {
    return 'Opera';
  }
  
  return 'Other';
}

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  
  return sessionId;
}

// Get page type from pathname
export function getPageType(pathname: string): AnalyticsData['pageType'] {
  if (pathname === '/') return 'homepage';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/homes') return 'homes-list';
  if (pathname === '/floor-plans') return 'floor-plans-list';
  if (pathname.startsWith('/homes/')) return 'home';
  if (pathname.startsWith('/floor-plans/')) return 'floor-plan';
  
  return 'homepage';
}

// Extract home ID from pathname
export function getHomeIdFromPath(pathname: string): string | undefined {
  const match = pathname.match(/^\/homes\/([^\/]+)/);
  return match ? match[1] : undefined;
}

// Extract floor plan ID from pathname
export function getFloorPlanIdFromPath(pathname: string): string | undefined {
  const match = pathname.match(/^\/floor-plans\/([^\/]+)/);
  return match ? match[1] : undefined;
}

// Get page title
export function getPageTitle(): string {
  if (typeof window === 'undefined') return '';
  return document.title || window.location.pathname;
}

// Check if referrer is external
export function isExternalReferrer(referrer: string): boolean {
  if (!referrer) return false;
  
  try {
    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);
    return referrerUrl.origin !== currentUrl.origin;
  } catch {
    return false;
  }
}

// Format referrer for display
export function formatReferrer(referrer: string | undefined): string {
  if (!referrer) return 'Direct';
  
  try {
    const url = new URL(referrer);
    
    // Common social media platforms
    if (url.hostname.includes('facebook.com')) return 'Facebook';
    if (url.hostname.includes('instagram.com')) return 'Instagram';
    if (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) return 'Twitter/X';
    if (url.hostname.includes('linkedin.com')) return 'LinkedIn';
    if (url.hostname.includes('youtube.com')) return 'YouTube';
    if (url.hostname.includes('tiktok.com')) return 'TikTok';
    
    // Search engines
    if (url.hostname.includes('google.com')) return 'Google';
    if (url.hostname.includes('bing.com')) return 'Bing';
    if (url.hostname.includes('yahoo.com')) return 'Yahoo';
    if (url.hostname.includes('duckduckgo.com')) return 'DuckDuckGo';
    
    // Return the domain name
    return url.hostname.replace('www.', '');
  } catch {
    return referrer;
  }
}

// Generate analytics data from current page
export function generateAnalyticsData(): Omit<AnalyticsData, 'homeId' | 'floorPlanId'> & { homeId?: string; floorPlanId?: string } {
  if (typeof window === 'undefined') {
    return {
      pagePath: '',
      pageTitle: '',
      pageType: 'homepage',
      deviceType: 'desktop',
      sessionId: '',
    };
  }

  const userAgent = navigator.userAgent;
  const pathname = window.location.pathname;
  const pageType = getPageType(pathname);
  
  let homeId: string | undefined;
  let floorPlanId: string | undefined;
  
  if (pageType === 'home') {
    homeId = getHomeIdFromPath(pathname);
  } else if (pageType === 'floor-plan') {
    floorPlanId = getFloorPlanIdFromPath(pathname);
  }

  return {
    pagePath: pathname,
    pageTitle: getPageTitle(),
    pageType,
    homeId,
    floorPlanId,
    referrer: document.referrer || undefined,
    userAgent,
    deviceType: getDeviceType(userAgent),
    browser: getBrowser(userAgent),
    sessionId: getSessionId(),
  };
}
