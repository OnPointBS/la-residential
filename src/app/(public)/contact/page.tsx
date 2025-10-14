"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ContactForm } from "@/components/public/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const settings = useQuery(api.settings.get);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to start your next project? We'd love to hear from you. 
            Get in touch and let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {settings?.companyPhone && (
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">{settings.companyPhone}</p>
                      <p className="text-sm text-gray-500">
                        Call us for immediate assistance
                      </p>
                    </div>
                  </div>
                )}
                
                {settings?.companyEmail && (
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{settings.companyEmail}</p>
                      <p className="text-sm text-gray-500">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                )}
                
                {settings?.companyAddress && (
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Office</h3>
                      <p className="text-gray-600">{settings.companyAddress}</p>
                      <p className="text-sm text-gray-500">
                        Visit us by appointment
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: By appointment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does a typical home construction take?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Construction timelines vary depending on the size and complexity of the project. 
                    Most homes take 6-12 months from groundbreaking to completion.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you offer custom home design?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! We work with our clients to create custom designs that meet their 
                    specific needs and preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What areas do you serve?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We serve the greater North Carolina area including Charlotte, Raleigh, Durham, 
                    Greensboro, Winston-Salem, Asheville, and surrounding communities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you provide financing options?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    While we don't provide financing directly, we can connect you with trusted 
                    lenders who specialize in construction loans.
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Location
              </h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">Interactive Map</p>
                    <p className="text-sm opacity-90">
                      {settings?.companyAddress || "North Carolina"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
