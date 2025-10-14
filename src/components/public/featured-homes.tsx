"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HomeCard } from "./home-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedHomes() {
  const featuredHomes = useQuery(api.homes.getFeatured);

  // Debug logging
  console.log("FeaturedHomes - featuredHomes:", featuredHomes);

  if (!featuredHomes) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Homes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Each home is as individual as you are. We utilize quality materials 
            and deliver excellent craftsmanship on every home we build.
          </p>
        </div>

        {featuredHomes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredHomes.map((home) => (
              <HomeCard key={home._id} home={home} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              No featured homes are currently available. Check back soon for new listings!
            </p>
            <Link
              href="/floor-plans"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Floor Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/homes"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            View All Homes for Sale
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
