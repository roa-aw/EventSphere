"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  "All Categories",
  "AI",
  "Blockchain",
  "Cybersecurity",
  "Web Development",
  "Data Science",
  "Cloud Computing",
  "DevOps",
  "Mobile",
]

export default function EventFilters({
  searchTerm,
  searchQuery, // V0 compatibility
  onSearchChange,
  onReset,
  selectedCategory,
  onCategoryChange,
  className,
}) {
  const value = searchTerm ?? searchQuery ?? ""

  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-col sm:flex-row gap-4">

        {/* 🔍 SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search events..."
            value={value}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* 🧹 RESET BUTTON (your feature) */}
        {value && onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Clear
          </button>
        )}

        {/* 🧩 CATEGORY FILTER (new from V0, optional) */}
        {onCategoryChange && (
          <select
            value={selectedCategory || "All Categories"}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:w-48"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}

      </div>
    </div>
  )
}