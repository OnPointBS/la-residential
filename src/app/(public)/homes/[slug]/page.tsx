import { ConvexClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowLeft,
  Download,
  ExternalLink,
  Play
} from "lucide-react";
import { formatPrice, formatSquareFootage, formatDate } from "@/lib/utils";
import { HOME_STATUSES } from "@/lib/constants";
import { ContactForm } from "@/components/public/contact-form";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface HomeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: HomeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const home = await convex.query(api.homes.getBySlug, { slug });
    
    if (!home) {
      return {
        title: "Home Not Found | LA Residential",
        description: "The requested home listing could not be found.",
      };
    }

    const statusConfig = HOME_STATUSES.find(s => s.value === home.status);
    const priceText = home.price ? ` Starting at ${formatPrice(home.price)}.` : "";
    const statusText = statusConfig ? ` ${statusConfig.label}.` : "";
    
    return {
      title: `${home.name} | LA Residential - A Branch of Furr Construction`,
      description: `${home.description} ${formatSquareFootage(home.squareFootage)} home with ${home.bedrooms} bedrooms and ${home.bathrooms} bathrooms located at ${home.address}.${priceText}${statusText} Contact us today to learn more about this beautiful home.`,
      keywords: [
        home.name,
        "home for sale",
        "new home",
        "Charlotte NC",
        "North Carolina",
        "home builder",
        "Furr Construction",
        "LA Residential",
        `${home.bedrooms} bedroom`,
        `${home.bathrooms} bathroom`,
        formatSquareFootage(home.squareFootage),
        home.address,
        ...home.features
      ].join(", "),
      openGraph: {
        title: `${home.name} | LA Residential`,
        description: `${home.description} ${formatSquareFootage(home.squareFootage)} home with ${home.bedrooms} bedrooms and ${home.bathrooms} bathrooms.`,
        type: "website",
        url: `https://la-residential.vercel.app/homes/${home.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${home.name} | LA Residential`,
        description: `${home.description} ${formatSquareFootage(home.squareFootage)} home with ${home.bedrooms} bedrooms and ${home.bathrooms} bathrooms.`,
      },
    };
  } catch (error) {
    return {
      title: "Home Listing | LA Residential",
      description: "View our beautiful home listings in North Carolina.",
    };
  }
}

export default async function HomeDetailPage({ params }: HomeDetailPageProps) {
  const { slug } = await params;
  
  let home;
  try {
    home = await convex.query(api.homes.getBySlug, { slug });
  } catch (error) {
    console.error("Error fetching home:", error);
    notFound();
  }

  if (home === null) {
    notFound();
  }

  if (!home) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 rounded-lg"></div>
                <div className="h-24 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let heroImageUrl = null;
  if (home.heroImageId) {
    try {
      heroImageUrl = await convex.query(api.files.getUrl, {
        storageId: home.heroImageId,
      });
    } catch (error) {
      console.error("Error fetching hero image URL:", error);
    }
  }

  const statusConfig = HOME_STATUSES.find(s => s.value === home.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/homes"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={home.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {statusConfig && (
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white ${statusConfig.color}`}>
                  {statusConfig.label}
                </div>
              )}
            </div>

            {/* Home Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {home.name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Home className="h-5 w-5 mr-3" />
                  <span>{formatSquareFootage(home.squareFootage)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{home.address}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <span className="mr-3">🛏️</span>
                  <span>{home.bedrooms} bedrooms</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <span className="mr-3">🚿</span>
                  <span>{home.bathrooms} bathrooms</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {home.description}
              </p>
            </div>

            {/* Features */}
            {home.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {home.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Sections */}
            {home.tourUrl3d && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  3D Virtual Tour
                </h2>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <a
                    href={home.tourUrl3d}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View 3D Tour
                  </a>
                </div>
              </div>
            )}

            {home.videoTourUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video Tour
                </h2>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <a
                    href={home.videoTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Video
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {home.price && (
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(home.price)}
                  </div>
                  <div className="text-gray-600">Starting Price</div>
                </div>
              )}
              
              <ContactForm homeId={home._id} />
            </div>

            {/* Floor Plan */}
            {home.floorPlan && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Floor Plan
                </h3>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {home.floorPlan.name}
                  </p>
                  <Link
                    href={`/floor-plans/${home.floorPlan.slug}`}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Floor Plan
                  </Link>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage</span>
                  <span className="font-medium">{formatSquareFootage(home.squareFootage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-medium">{home.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-medium">{home.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size</span>
                  <span className="font-medium">{home.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium">{statusConfig?.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
