"use client";

import { Users, Award, Home, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { TeamMember } from "@/components/public/team-member";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About LA Residential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Family-owned since 1991. We treat our clients like family with quality 
            craftsmanship, honest communication, and exceptional service. Let our family serve yours.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At Furr Construction and Development, Inc., we understand that your home is 
                likely to be the biggest investment of your life. We take great pride in offering 
                our clients a variety of floor plans that best suit their needs.
              </p>
              <p>
                During the construction of our homes, we utilize quality materials and deliver 
                excellent craftsmanship on each and every one of our homes. Your trust in us 
                means everything – and we believe that service after the sale is just as 
                important as before and during every transaction.
              </p>
              <p>
                Communication is also key. With honesty, integrity and transparency at the 
                forefront … we listen to you. As a family-owned and operated company since 1991, 
                we also make this vow: We treat our clients like family.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Home className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Quality Built Homes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Family-Owned Since 1991
              </h3>
              <p className="text-gray-600">
                Three decades of family tradition in home building with deep roots in our community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                We Treat You Like Family
              </h3>
              <p className="text-gray-600">
                Honest communication, transparency, and integrity guide every interaction with our clients.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Materials & Craftsmanship
              </h3>
              <p className="text-gray-600">
                We utilize quality materials and deliver excellent craftsmanship on every home we build.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Service After Sale
              </h3>
              <p className="text-gray-600">
                Your trust means everything. Service after the sale is just as important as before and during.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TeamMember
              name="Lauren Furr"
              role="Co-founder & Operations Manager"
              description="Lauren is a dedicated and enthusiastic professional committed to helping clients achieve their goals with Furr Construction. Originally from a small town near Greensboro, North Carolina, Lauren began her career in the healthcare field. She earned a degree in Radiologic Science with a specialization in Mammography from Pitt Community College and spent eight years building meaningful relationships with her patients, their families, and her colleagues. Despite her rewarding career in healthcare, Lauren discovered a new passion when she met & married Adam, and became involved in the home building and construction industry. Her growing interest in real estate soon turned into a full-fledged passion, leading her to obtain her real estate license and transition into the family business, which has proudly served the Fayetteville area since 1991. Lauren now serves as the Chairperson of the Professional Women in Building of the Sandhills and actively participates in the Home Builders Association of Fayetteville, where she contributes to various committees. She is also involved with the Fayetteville Police Foundation, strengthening her ties with both the building industry and local community. Outside of work, Lauren enjoys traveling, photography, and spending time with her husband, their daughter Madelyn, and their beloved dogs, Cooper and Lady, who are often by her side."
              imageName="Lauren"
            />
            
            <TeamMember
              name="Adam Furr"
              role="Co-founder & Director of Construction"
              description="Adam is a dedicated professional with a strong foundation in construction management, having earned his BS in Construction Management and a minor in Business from East Carolina University. His journey in home building began with his family business, and since then, Adam has successfully built and closed over 500 homes, delivering satisfaction to homeowners across eastern North Carolina. As the Director of Construction at Furr Construction, Adam plays a pivotal role in overseeing the home building process. He collaborates closely with subcontractors, real estate agents, homeowners, and designers to ensure each project meets the highest standards of quality and efficiency. I am truly lucky to have found a passion in building homes and turned it into a career. It is my goal to provide our homeowners with transparency, quality, and a home built in a timely fashion. Your home is our reputation, let my family here at Furr Construction serve yours. In addition to his role at Furr Construction, Adam is currently the President of the Fayetteville Home Builders Association of Fayetteville. He also serves as a board member for the Fayetteville Police Foundation. Adam resides in the Eastover community with his wife Lauren and their daughter Madelyn."
              imageName="Adam"
            />
          </div>
        </div>

        {/* Service Area */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Service Area
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Our Service Areas
              </h3>
              <p className="text-gray-600">
                We proudly serve clients in our local communities with personalized attention and care
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                "Charlotte",
                "Raleigh",
                "Durham",
                "Greensboro",
                "Winston-Salem",
                "Asheville",
                "Wilmington",
                "Fayetteville"
              ].map((area) => (
                <div key={area} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Let Our Family Serve Yours
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to build your dream home? Contact Lauren & Adam to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Contact Lauren & Adam
            </Link>
            <Link
              href="/homes"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View Homes for Sale
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
