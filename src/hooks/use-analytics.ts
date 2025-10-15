"use client";

import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { generateAnalyticsData } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const trackPageView = useMutation(api.analytics.trackPageView);
  const pathname = usePathname();

  useEffect(() => {
    // Only track on client side
    if (typeof window === 'undefined') return;

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
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
        console.error('Failed to track page view:', error);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, trackPageView]);

  return {
    trackPageView,
  };
}
