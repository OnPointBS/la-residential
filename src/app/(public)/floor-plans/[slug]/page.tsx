import { ConvexClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Home, 
  ArrowLeft,
  Download,
  Square,
  Users,
  Car
} from "lucide-react";
import { formatSquareFootage } from "@/lib/utils";
import { HomeCard } from "@/components/public/home-card";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface FloorPlanDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FloorPlanDetailPage({ params }: FloorPlanDetailPageProps) {
  const { slug } = await params;
  
  let floorPlan;
  try {
    floorPlan = await convex.query(api.floorPlans.getBySlug, { slug });
  } catch (error) {
    console.error("Error fetching floor plan:", error);
    notFound();
  }

  if (floorPlan === null) {
    notFound();
  }

  let imageUrl = null;
  if (floorPlan.imageId) {
    try {
      imageUrl = await convex.query(api.files.getUrl, {
        storageId: floorPlan.imageId,
      });
    } catch (error) {
      console.error("Error fetching floor plan image URL:", error);
    }
  }

  let pdfUrl = null;
  if (floorPlan.pdfId) {
    try {
      pdfUrl = await convex.query(api.files.getUrl, {
        storageId: floorPlan.pdfId,
      });
    } catch (error) {
      console.error("Error fetching floor plan PDF URL:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/floor-plans"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Floor Plans
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Floor Plan Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6 bg-white">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={floorPlan.name}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Floor Plan Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {floorPlan.name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Square className="h-5 w-5 mr-3" />
                  <span>{formatSquareFootage(floorPlan.squareFootage)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <span>{floorPlan.bedrooms} bedrooms</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Car className="h-5 w-5 mr-3" />
                  <span>{floorPlan.bathrooms} bathrooms</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {floorPlan.description}
              </p>
            </div>

            {/* Available Homes Using This Plan */}
            {floorPlan.homes && floorPlan.homes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Available Homes Using This Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorPlan.homes.map((home) => (
                    <HomeCard key={home._id} home={home} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download PDF */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Download Floor Plan
              </h3>
              <p className="text-gray-600 mb-4">
                Get a detailed PDF of this floor plan with measurements and specifications.
              </p>
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  download
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF Not Available
                </button>
              )}
            </div>

            {/* Plan Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Specifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage</span>
                  <span className="font-medium">{formatSquareFootage(floorPlan.squareFootage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-medium">{floorPlan.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-medium">{floorPlan.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan Type</span>
                  <span className="font-medium">Single Family</span>
                </div>
              </div>
            </div>

            {/* Contact for Customization */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Interested in This Plan?
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                This floor plan can be customized to meet your specific needs and preferences.
              </p>
              <Link
                href="/contact"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center block"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
