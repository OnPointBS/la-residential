"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FloorPlanCard } from "@/components/public/floor-plan-card";
import { AdvancedFloorPlanSearch } from "@/components/public/advanced-floor-plan-search";
import { useState } from "react";
import { Filter } from "lucide-react";

export default function FloorPlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [bathroomFilter, setBathroomFilter] = useState<string>("all");
  const [minSquareFootage, setMinSquareFootage] = useState("");
  const [maxSquareFootage, setMaxSquareFootage] = useState("");
  
  const allFloorPlans = useQuery(api.floorPlans.getAll);

  if (!allFloorPlans) {
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

  // Filter floor plans based on all criteria
  const filteredFloorPlans = allFloorPlans.filter((plan) => {
    // Text search
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Bedroom filter
    const matchesBedrooms = bedroomFilter === "all" || plan.bedrooms >= parseInt(bedroomFilter);
    
    // Bathroom filter
    const matchesBathrooms = bathroomFilter === "all" || plan.bathrooms >= parseFloat(bathroomFilter);
    
    // Square footage filters
    const matchesMinSqft = !minSquareFootage || plan.squareFootage >= parseInt(minSquareFootage);
    const matchesMaxSqft = !maxSquareFootage || plan.squareFootage <= parseInt(maxSquareFootage);
    
    return matchesSearch && matchesBedrooms && matchesBathrooms && matchesMinSqft && matchesMaxSqft;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Floor Plans
          </h1>
          <p className="text-lg text-gray-600">
            Explore our collection of thoughtfully designed floor plans, 
            each crafted to maximize space, comfort, and functionality.
          </p>
        </div>

        {/* Advanced Search */}
        <AdvancedFloorPlanSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          bedroomFilter={bedroomFilter}
          setBedroomFilter={setBedroomFilter}
          bathroomFilter={bathroomFilter}
          setBathroomFilter={setBathroomFilter}
          minSquareFootage={minSquareFootage}
          setMinSquareFootage={setMinSquareFootage}
          maxSquareFootage={maxSquareFootage}
          setMaxSquareFootage={setMaxSquareFootage}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFloorPlans.length} of {allFloorPlans.length} floor plans
          </p>
        </div>

        {/* Floor Plans Grid */}
        {filteredFloorPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFloorPlans.map((floorPlan) => (
              <FloorPlanCard key={floorPlan._id} floorPlan={floorPlan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No floor plans found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setBedroomFilter("all");
                setBathroomFilter("all");
                setMinSquareFootage("");
                setMaxSquareFootage("");
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
