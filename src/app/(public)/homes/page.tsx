"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HomeCard } from "@/components/public/home-card";
import { AdvancedHomeSearch } from "@/components/public/advanced-home-search";
import { useState } from "react";
import { Filter } from "lucide-react";

export default function HomesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSquareFootage, setMinSquareFootage] = useState("");
  const [maxSquareFootage, setMaxSquareFootage] = useState("");
  const [bedrooms, setBedrooms] = useState("all");
  const [bathrooms, setBathrooms] = useState("all");
  
  const allHomes = useQuery(api.homes.getAll);

  if (!allHomes) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
    );
  }

  // Filter homes based on all criteria
  const filteredHomes = allHomes.filter((home) => {
    // Text search
    const matchesSearch = 
      home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.features.some(feature => 
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Status filter
    const matchesStatus = statusFilter === "all" || home.status === statusFilter;
    
    // Price filters
    const matchesMinPrice = !minPrice || home.price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || home.price <= parseInt(maxPrice);
    
    // Square footage filters
    const matchesMinSqft = !minSquareFootage || home.squareFootage >= parseInt(minSquareFootage);
    const matchesMaxSqft = !maxSquareFootage || home.squareFootage <= parseInt(maxSquareFootage);
    
    // Bedroom filter
    const matchesBedrooms = bedrooms === "all" || home.bedrooms >= parseInt(bedrooms);
    
    // Bathroom filter
    const matchesBathrooms = bathrooms === "all" || home.bathrooms >= parseFloat(bathrooms);
    
    return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice && 
           matchesMinSqft && matchesMaxSqft && matchesBedrooms && matchesBathrooms;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Homes
          </h1>
          <p className="text-lg text-gray-600">
            Discover our collection of beautifully designed homes in North Carolina.
          </p>
        </div>

        {/* Advanced Search */}
        <AdvancedHomeSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minSquareFootage={minSquareFootage}
          setMinSquareFootage={setMinSquareFootage}
          maxSquareFootage={maxSquareFootage}
          setMaxSquareFootage={setMaxSquareFootage}
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          bathrooms={bathrooms}
          setBathrooms={setBathrooms}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredHomes.length} of {allHomes.length} homes
          </p>
        </div>

        {/* Homes Grid */}
        {filteredHomes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHomes.map((home) => (
              <HomeCard key={home._id} home={home} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No homes found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setMinPrice("");
                setMaxPrice("");
                setMinSquareFootage("");
                setMaxSquareFootage("");
                setBedrooms("all");
                setBathrooms("all");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
