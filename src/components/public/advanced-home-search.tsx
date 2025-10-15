"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { HOME_STATUSES } from "@/lib/constants";

interface AdvancedSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  minSquareFootage: string;
  setMinSquareFootage: (sqft: string) => void;
  maxSquareFootage: string;
  setMaxSquareFootage: (sqft: string) => void;
  bedrooms: string;
  setBedrooms: (bedrooms: string) => void;
  bathrooms: string;
  setBathrooms: (bathrooms: string) => void;
}

export function AdvancedHomeSearch({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minSquareFootage,
  setMinSquareFootage,
  maxSquareFootage,
  setMaxSquareFootage,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
}: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = 
    statusFilter !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minSquareFootage !== "" ||
    maxSquareFootage !== "" ||
    bedrooms !== "all" ||
    bathrooms !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setMinSquareFootage("");
    setMaxSquareFootage("");
    setBedrooms("all");
    setBathrooms("all");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search homes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Statuses</option>
            {HOME_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Square Footage Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Square Footage
              </label>
              <input
                type="number"
                placeholder="Min sq ft"
                value={minSquareFootage}
                onChange={(e) => setMinSquareFootage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Square Footage
              </label>
              <input
                type="number"
                placeholder="Max sq ft"
                value={maxSquareFootage}
                onChange={(e) => setMaxSquareFootage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
                <option value="3.5">3.5+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
