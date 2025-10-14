"use client";

import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function ContactCTA() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Let Our Family Serve Yours
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Communication is key. With honesty, integrity and transparency at the forefront, 
          we listen to you. Contact Lauren & Adam to discuss your dream home.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <Phone className="h-8 w-8 text-white mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
            <p className="text-blue-100 text-sm">Speak directly with our team</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <Mail className="h-8 w-8 text-white mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
            <p className="text-blue-100 text-sm">Get detailed information</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <MessageCircle className="h-8 w-8 text-white mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Contact Form</h3>
            <p className="text-blue-100 text-sm">Send us your requirements</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Contact Lauren & Adam
          </Link>
          <Link
            href="/homes"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            View Homes for Sale
          </Link>
        </div>
      </div>
    </section>
  );
}
