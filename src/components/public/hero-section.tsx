"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Let Our Family{" "}
            <span className="text-blue-300">Serve Yours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Family-owned since 1991. We treat our clients like family with 
            quality craftsmanship, honest communication, and exceptional service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/homes"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center group"
            >
              View Homes for Sale
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Contact Lauren & Adam
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" />
              <span className="text-blue-100">Family-Owned Since 1991</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" />
              <span className="text-blue-100">Quality Craftsmanship</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" />
              <span className="text-blue-100">Honest Communication</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
