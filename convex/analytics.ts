import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Track a page view
export const trackPageView = mutation({
  args: {
    pagePath: v.string(),
    pageTitle: v.string(),
    pageType: v.union(
      v.literal("home"),
      v.literal("floor-plan"),
      v.literal("about"),
      v.literal("contact"),
      v.literal("homes-list"),
      v.literal("floor-plans-list"),
      v.literal("homepage")
    ),
    homeId: v.optional(v.id("homes")),
    floorPlanId: v.optional(v.id("floorPlans")),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    deviceType: v.union(v.literal("desktop"), v.literal("mobile"), v.literal("tablet")),
    browser: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    
    // Insert page view
    await ctx.db.insert("pageViews", {
      ...args,
      timestamp,
    });

    // Update or create session
    if (args.sessionId) {
      const existingSession = await ctx.db
        .query("analyticsSessions")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();

      if (existingSession) {
        await ctx.db.patch(existingSession._id, {
          lastActivity: timestamp,
          pageViews: existingSession.pageViews + 1,
        });
      } else {
        await ctx.db.insert("analyticsSessions", {
          sessionId: args.sessionId,
          startTime: timestamp,
          lastActivity: timestamp,
          pageViews: 1,
          referrer: args.referrer,
          userAgent: args.userAgent,
          ipAddress: args.ipAddress,
          country: args.country,
          city: args.city,
          deviceType: args.deviceType,
          browser: args.browser,
          isBot: false,
        });
      }
    }
  },
});

// Get page view statistics
export const getPageViewStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = args.endDate || Date.now();

    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) => 
        q.gte("timestamp", startDate).lte("timestamp", endDate)
      )
      .collect();

    // Group by page type
    const statsByType = pageViews.reduce((acc, view) => {
      if (!acc[view.pageType]) {
        acc[view.pageType] = { count: 0, uniqueViews: new Set() };
      }
      acc[view.pageType].count++;
      if (view.sessionId) {
        acc[view.pageType].uniqueViews.add(view.sessionId);
      }
      return acc;
    }, {} as Record<string, { count: number; uniqueViews: Set<string> }>);

    // Convert to array format
    const pageTypeStats = Object.entries(statsByType).map(([type, data]) => ({
      pageType: type,
      totalViews: data.count,
      uniqueViews: data.uniqueViews.size,
    }));

    // Get top pages
    const pageStats = pageViews.reduce((acc, view) => {
      const key = view.pagePath;
      if (!acc[key]) {
        acc[key] = {
          pagePath: view.pagePath,
          pageTitle: view.pageTitle,
          pageType: view.pageType,
          totalViews: 0,
          uniqueViews: new Set(),
        };
      }
      acc[key].totalViews++;
      if (view.sessionId) {
        acc[key].uniqueViews.add(view.sessionId);
      }
      return acc;
    }, {} as Record<string, any>);

    const topPages = Object.values(pageStats)
      .map(page => ({
        ...page,
        uniqueViews: page.uniqueViews.size,
      }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 20);

    return {
      totalPageViews: pageViews.length,
      uniqueVisitors: new Set(pageViews.map(v => v.sessionId).filter(Boolean)).size,
      pageTypeStats,
      topPages,
      dateRange: { startDate, endDate },
    };
  },
});

// Get home-specific analytics
export const getHomeAnalytics = query({
  args: {
    homeId: v.id("homes"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const homeViews = await ctx.db
      .query("pageViews")
      .withIndex("by_home", (q) => q.eq("homeId", args.homeId))
      .filter((q) => 
        q.and(
          q.gte(q.field("timestamp"), startDate),
          q.lte(q.field("timestamp"), endDate)
        )
      )
      .collect();

    const uniqueVisitors = new Set(homeViews.map(v => v.sessionId).filter(Boolean)).size;
    
    // Group by referrer
    const referrerStats = homeViews.reduce((acc, view) => {
      const referrer = view.referrer || "Direct";
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by device type
    const deviceStats = homeViews.reduce((acc, view) => {
      acc[view.deviceType] = (acc[view.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by country
    const countryStats = homeViews.reduce((acc, view) => {
      if (view.country) {
        acc[view.country] = (acc[view.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalViews: homeViews.length,
      uniqueVisitors,
      referrerStats,
      deviceStats,
      countryStats,
      dateRange: { startDate, endDate },
    };
  },
});

// Get floor plan analytics
export const getFloorPlanAnalytics = query({
  args: {
    floorPlanId: v.id("floorPlans"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const floorPlanViews = await ctx.db
      .query("pageViews")
      .withIndex("by_floor_plan", (q) => q.eq("floorPlanId", args.floorPlanId))
      .filter((q) => 
        q.and(
          q.gte(q.field("timestamp"), startDate),
          q.lte(q.field("timestamp"), endDate)
        )
      )
      .collect();

    const uniqueVisitors = new Set(floorPlanViews.map(v => v.sessionId).filter(Boolean)).size;
    
    // Group by referrer
    const referrerStats = floorPlanViews.reduce((acc, view) => {
      const referrer = view.referrer || "Direct";
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by device type
    const deviceStats = floorPlanViews.reduce((acc, view) => {
      acc[view.deviceType] = (acc[view.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by country
    const countryStats = floorPlanViews.reduce((acc, view) => {
      if (view.country) {
        acc[view.country] = (acc[view.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalViews: floorPlanViews.length,
      uniqueVisitors,
      referrerStats,
      deviceStats,
      countryStats,
      dateRange: { startDate, endDate },
    };
  },
});

// Get traffic sources
export const getTrafficSources = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) => 
        q.gte("timestamp", startDate).lte("timestamp", endDate)
      )
      .collect();

    // Group by referrer
    const referrerStats = pageViews.reduce((acc, view) => {
      const referrer = view.referrer || "Direct";
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by country
    const countryStats = pageViews.reduce((acc, view) => {
      if (view.country) {
        acc[view.country] = (acc[view.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Group by device type
    const deviceStats = pageViews.reduce((acc, view) => {
      acc[view.deviceType] = (acc[view.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by browser
    const browserStats = pageViews.reduce((acc, view) => {
      if (view.browser) {
        acc[view.browser] = (acc[view.browser] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      referrerStats: Object.entries(referrerStats)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      countryStats: Object.entries(countryStats)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      deviceStats: Object.entries(deviceStats)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count),
      browserStats: Object.entries(browserStats)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
      totalSessions: new Set(pageViews.map(v => v.sessionId).filter(Boolean)).size,
      dateRange: { startDate, endDate },
    };
  },
});

// Get daily analytics for charts
export const getDailyAnalytics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) => 
        q.gte("timestamp", startDate).lte("timestamp", endDate)
      )
      .collect();

    // Group by day
    const dailyStats = pageViews.reduce((acc, view) => {
      const date = new Date(view.timestamp);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          date: dayKey,
          pageViews: 0,
          uniqueVisitors: new Set(),
        };
      }
      
      acc[dayKey].pageViews++;
      if (view.sessionId) {
        acc[dayKey].uniqueVisitors.add(view.sessionId);
      }
      
      return acc;
    }, {} as Record<string, { date: string; pageViews: number; uniqueVisitors: Set<string> }>);

    // Convert to array and sort by date
    const dailyData = Object.values(dailyStats)
      .map(day => ({
        date: day.date,
        pageViews: day.pageViews,
        uniqueVisitors: day.uniqueVisitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return dailyData;
  },
});

// Get all homes with their analytics
export const getHomesWithAnalytics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const homes = await ctx.db.query("homes").collect();
    
    const homesWithAnalytics = await Promise.all(
      homes.map(async (home) => {
        const homeViews = await ctx.db
          .query("pageViews")
          .withIndex("by_home", (q) => q.eq("homeId", home._id))
          .filter((q) => 
            q.and(
              q.gte(q.field("timestamp"), startDate),
              q.lte(q.field("timestamp"), endDate)
            )
          )
          .collect();

        const uniqueVisitors = new Set(homeViews.map(v => v.sessionId).filter(Boolean)).size;

        return {
          ...home,
          totalViews: homeViews.length,
          uniqueVisitors,
        };
      })
    );

    return homesWithAnalytics.sort((a, b) => b.totalViews - a.totalViews);
  },
});

// Get all floor plans with their analytics
export const getFloorPlansWithAnalytics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || (Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = args.endDate || Date.now();

    const floorPlans = await ctx.db.query("floorPlans").collect();
    
    const floorPlansWithAnalytics = await Promise.all(
      floorPlans.map(async (floorPlan) => {
        const floorPlanViews = await ctx.db
          .query("pageViews")
          .withIndex("by_floor_plan", (q) => q.eq("floorPlanId", floorPlan._id))
          .filter((q) => 
            q.and(
              q.gte(q.field("timestamp"), startDate),
              q.lte(q.field("timestamp"), endDate)
            )
          )
          .collect();

        const uniqueVisitors = new Set(floorPlanViews.map(v => v.sessionId).filter(Boolean)).size;

        return {
          ...floorPlan,
          totalViews: floorPlanViews.length,
          uniqueVisitors,
        };
      })
    );

    return floorPlansWithAnalytics.sort((a, b) => b.totalViews - a.totalViews);
  },
});
