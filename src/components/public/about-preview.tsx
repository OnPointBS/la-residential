"use client";

import Link from "next/link";
import { Users, Award, Home, MapPin } from "lucide-react";

export function AboutPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About LA Residential
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At Furr Construction and Development, Inc., we understand that your home is 
              likely to be the biggest investment of your life. We take great pride in offering 
              our clients a variety of floor plans that best suit their needs.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              During the construction of our homes, we utilize quality materials and deliver 
              excellent craftsmanship on each and every one of our homes. Your trust in us 
              means everything – and we believe that service after the sale is just as 
              important as before and during every transaction.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Family-Owned</div>
                  <div className="text-gray-600 text-sm">Since 1991</div>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Quality Materials</div>
                  <div className="text-gray-600 text-sm">Excellent craftsmanship</div>
                </div>
              </div>
              <div className="flex items-center">
                <Home className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Honest Communication</div>
                  <div className="text-gray-600 text-sm">Transparency & integrity</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Service After Sale</div>
                  <div className="text-gray-600 text-sm">Lifetime commitment</div>
                </div>
              </div>
            </div>
            
            <Link
              href="/about"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
          
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Home className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Your Dream Home Awaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
