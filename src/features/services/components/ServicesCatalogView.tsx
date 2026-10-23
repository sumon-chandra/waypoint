"use client";

import * as React from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LOGISTICS_SERVICES, ServiceItem } from "../data/services-data";
import { ServiceCard } from "./ServiceCard";
import { AiSearchSuggestions } from "@/features/ai";
import { cn } from "@/lib/utils";

type SortOption = "popularity" | "price-asc" | "price-desc" | "rating-desc" | "speed-asc";

const CATEGORIES = [
  "All Categories",
  "Express Courier",
  "City Transit",
  "Heavy Freight",
  "Cold Chain",
  "E-Commerce COD",
  "Document Rush",
] as const;

const LOCATIONS = [
  { label: "All Coverage Areas", value: "all" },
  { label: "All Bangladesh (64 Districts)", value: "all-bangladesh" },
  { label: "Dhaka & Chittagong Metro", value: "dhaka-metro" },
  { label: "Divisional Gateways", value: "divisional-gateways" },
];

const PRICE_TIERS = [
  { label: "All Price Tiers", value: "all" },
  { label: "Budget (< ৳100)", value: "budget" },
  { label: "Standard (৳100 - ৳250)", value: "standard" },
  { label: "Enterprise (> ৳250)", value: "enterprise" },
];

const RATING_TIERS = [
  { label: "All Ratings", value: 0 },
  { label: "4.5+ ★ Stars", value: 4.5 },
  { label: "4.8+ ★ Stars", value: 4.8 },
];

export function ServicesCatalogView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All Categories");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("all");
  const [selectedPriceTier, setSelectedPriceTier] = React.useState<string>("all");
  const [selectedRating, setSelectedRating] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState<SortOption>("popularity");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAiSuggestionsVisible, setIsAiSuggestionsVisible] = React.useState(false);

  const itemsPerPage = 8; // 2 rows of 4 cards on desktop

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, selectedPriceTier, selectedRating, sortBy]);

  // Multi-field filtering logic
  const filteredServices = React.useMemo(() => {
    return LOGISTICS_SERVICES.filter((service) => {
      // 1. Text Search Query
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase().trim();
        const matchesText =
          service.title.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q) ||
          service.tagline.toLowerCase().includes(q) ||
          service.category.toLowerCase().includes(q) ||
          service.coverage.toLowerCase().includes(q) ||
          service.features.some((f) => f.toLowerCase().includes(q));

        if (!matchesText) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All Categories" && service.category !== selectedCategory) {
        return false;
      }

      // 3. Location / Coverage Filter
      if (selectedLocation !== "all" && service.locationArea !== selectedLocation) {
        return false;
      }

      // 4. Price Tier Filter
      if (selectedPriceTier !== "all") {
        if (selectedPriceTier === "budget" && service.price >= 100) return false;
        if (selectedPriceTier === "standard" && (service.price < 100 || service.price > 250)) return false;
        if (selectedPriceTier === "enterprise" && service.price <= 250) return false;
      }

      // 5. Minimum Rating Filter
      if (selectedRating > 0 && service.rating < selectedRating) {
        return false;
      }

      return true;
    });
  }, [debouncedQuery, selectedCategory, selectedLocation, selectedPriceTier, selectedRating]);

  // Sorting logic
  const sortedServices = React.useMemo(() => {
    const list = [...filteredServices];

    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case "speed-asc":
        return list.sort((a, b) => a.speedHours - b.speedHours);
      case "popularity":
      default:
        return list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviewCount - a.reviewCount);
    }
  }, [filteredServices, sortBy]);

  // Pagination calculation
  const totalItems = sortedServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);

  // Active filters count
  const activeFiltersCount =
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedLocation !== "all" ? 1 : 0) +
    (selectedPriceTier !== "all" ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCategory("All Categories");
    setSelectedLocation("all");
    setSelectedPriceTier("all");
    setSelectedRating(0);
    setSortBy("popularity");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-6 shadow-sm backdrop-blur-md space-y-4">
        {/* Search Bar with AI Suggestions Dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsAiSuggestionsVisible(true)}
              onBlur={() => setTimeout(() => setIsAiSuggestionsVisible(false), 250)}
              placeholder="Search logistics services by name, speed (e.g. 'same-day'), category, or keywords..."
              className="pl-10 pr-9 h-11 text-xs sm:text-sm rounded-xl bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search input"
                className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* AI Search Suggestions Dropdown Overlay */}
          {isAiSuggestionsVisible && searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-30">
              <AiSearchSuggestions
                query={searchQuery}
                onSelectSuggestion={(sug) => {
                  setSearchQuery(sug.title);
                  setIsAiSuggestionsVisible(false);
                }}
              />
            </div>
          )}
        </div>

        {/* 4 Active Filter Controls & Sorting Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. Category Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by service category"
              className="w-full h-9 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Location / Coverage Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Coverage Area
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by geographic coverage"
              className="w-full h-9 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Price Tier Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Price Range
            </label>
            <select
              value={selectedPriceTier}
              onChange={(e) => setSelectedPriceTier(e.target.value)}
              aria-label="Filter by price tier"
              className="w-full h-9 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
            >
              {PRICE_TIERS.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Minimum Rating Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Customer Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              aria-label="Filter by minimum star rating"
              className="w-full h-9 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
            >
              {RATING_TIERS.map((rate) => (
                <option key={rate.value} value={rate.value}>
                  {rate.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="size-3 text-primary" />
              <span>Sort By</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort logistics services"
              className="w-full h-9 px-3 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="speed-asc">Fastest Delivery (SLA)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated (★)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills & Active State Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{totalItems}</strong> services available
            </span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-[10px] gap-1 bg-primary/10 text-primary border-primary/20">
                <SlidersHorizontal className="size-2.5" />
                <span>{activeFiltersCount} active filter{activeFiltersCount > 1 ? "s" : ""}</span>
              </Badge>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Reset All Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {paginatedServices.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center space-y-4 bg-card/40">
          <div className="size-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <PackageOpen className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No matching logistics services found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any delivery tiers matching your exact filter combination. Try clearing your search query or broadening the price/coverage filters.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Filters</span>
          </Button>
        </div>
      )}

      {/* Core Listing Grid — Strict 4 Cards Per Row on Desktop */}
      {paginatedServices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} priority={index < 4} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Showing Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong> ({totalItems} total services)
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-8 gap-1 rounded-xl text-xs cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "size-8 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 gap-1 rounded-xl text-xs cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesCatalogView;
