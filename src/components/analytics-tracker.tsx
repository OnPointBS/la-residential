"use client";

import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { generateAnalyticsData } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const trackPageView = useMutation(api.analytics.trackPageView);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only track on client side and after client hydration
    if (!isClient || typeof window === 'undefined') return;

    // Small delay to ensure page is fully loaded and Convex is ready
    const timer = setTimeout(() => {
      try {
        const analyticsData = generateAnalyticsData();
        
        // Track the page view
        trackPageView({
          pagePath: analyticsData.pagePath,
          pageTitle: analyticsData.pageTitle,
          pageType: analyticsData.pageType,
          homeId: analyticsData.homeId as any,
          floorPlanId: analyticsData.floorPlanId as any,
          referrer: analyticsData.referrer,
          userAgent: analyticsData.userAgent,
          deviceType: analyticsData.deviceType,
          browser: analyticsData.browser,
          sessionId: analyticsData.sessionId,
        }).catch(error => {
          // Silently fail in production, log in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to track page view:', error);
          }
        });
      } catch (error) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics error:', error);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, trackPageView, isClient]);

  return null;
}
