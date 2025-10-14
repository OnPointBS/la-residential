"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { SocialMediaLinks } from "./social-media-links";

export function Footer() {
  const settings = useQuery(api.settings.get);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LA</span>
              </div>
              <span className="text-xl font-bold">LA Residential</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Family-owned since 1991. We treat our clients like family with 
              quality craftsmanship, honest communication, and exceptional service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              {settings?.companyPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">{settings.companyPhone}</span>
                </div>
              )}
              {settings?.companyEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">{settings.companyEmail}</span>
                </div>
              )}
              {settings?.companyAddress && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                  <span className="text-gray-300">{settings.companyAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <SocialMediaLinks 
              size="md"
              showLabels={false}
              orientation="horizontal"
              className="flex-wrap"
            />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} LA Residential - A Branch of Furr Construction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
