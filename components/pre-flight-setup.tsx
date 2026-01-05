"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Search, MapPin, Clock, ArrowRight, Sparkles, Globe } from "lucide-react"
import { AIRPORTS, getRoute, formatDuration, formatDistance, getPopularRoutes, type Airport, type Route } from "@/lib/routes-data"

interface PreFlightSetupProps {
  onTakeOff: (route: Route) => void
}

// Country flags
const countryFlags: Record<string, string> = {
  "India": "🇮🇳", "UAE": "🇦🇪", "Qatar": "🇶🇦", "Saudi Arabia": "🇸🇦", "Bahrain": "🇧🇭",
  "Oman": "🇴🇲", "Kuwait": "🇰🇼", "Singapore": "🇸🇬", "Malaysia": "🇲🇾", "Thailand": "🇹🇭",
  "Indonesia": "🇮🇩", "Vietnam": "🇻🇳", "Philippines": "🇵🇭", "China": "🇨🇳", "Japan": "🇯🇵",
  "South Korea": "🇰🇷", "Taiwan": "🇹🇼", "UK": "🇬🇧", "France": "🇫🇷", "Germany": "🇩🇪",
  "Netherlands": "🇳🇱", "Spain": "🇪🇸", "Italy": "🇮🇹", "Switzerland": "🇨🇭", "Austria": "🇦🇹",
  "Turkey": "🇹🇷", "Russia": "🇷🇺", "Ireland": "🇮🇪", "USA": "🇺🇸", "Canada": "🇨🇦",
  "Mexico": "🇲🇽", "Brazil": "🇧🇷", "Argentina": "🇦🇷", "Colombia": "🇨🇴", "Peru": "🇵🇪",
  "Chile": "🇨🇱", "Australia": "🇦🇺", "New Zealand": "🇳🇿", "South Africa": "🇿🇦",
  "Egypt": "🇪🇬", "Kenya": "🇰🇪", "Morocco": "🇲🇦", "Israel": "🇮🇱", "Portugal": "🇵🇹",
  "Greece": "🇬🇷", "Denmark": "🇩🇰", "Sweden": "🇸🇪", "Norway": "🇳🇴", "Finland": "🇫🇮",
  "Belgium": "🇧🇪", "Czech Republic": "🇨🇿", "Poland": "🇵🇱", "Ethiopia": "🇪🇹", "Nigeria": "🇳🇬",
}

function getFlag(country: string): string {
  return countryFlags[country] || "🌍"
}

// Simplified Airport Selector with LARGE size
function AirportSelector({
  label,
  value,
  onChange,
  excludeCode,
}: {
  label: string
  value: Airport | null
  onChange: (airport: Airport) => void
  excludeCode?: string
}) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredAirports = useMemo(() => {
    const q = search.toLowerCase().trim()
    let airports = AIRPORTS.filter(a => a.code !== excludeCode)

    if (q) {
      airports = airports.filter(airport =>
        airport.code.toLowerCase().includes(q) ||
        airport.city.toLowerCase().includes(q) ||
        airport.country.toLowerCase().includes(q)
      )
    }

    return airports.slice(0, 50) // Show 50 airports for scrolling
  }, [search, excludeCode])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (airport: Airport) => {
    onChange(airport)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-bold tracking-wider mb-3 text-gray-400 uppercase">
        {label}
      </label>

      {/* LARGE Selected Display or Search */}
      {value && !isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-6 bg-slate-800/90 border-2 border-emerald-500/30 rounded-2xl text-left hover:border-emerald-500/60 hover:bg-slate-800 transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-4xl flex-shrink-0">
              {getFlag(value.country)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono font-bold text-3xl text-emerald-400">{value.code}</span>
                <span className="text-gray-600">•</span>
                <span className="text-white font-semibold text-xl truncate">{value.city}</span>
              </div>
              <div className="text-base text-gray-400 truncate">{value.country}</div>
            </div>
            <div className="text-gray-500 group-hover:text-emerald-400 transition-colors">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </button>
      ) : (
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city or airport code..."
            autoFocus={isOpen}
            className="w-full pl-16 pr-6 py-6 text-lg bg-slate-800/90 border-2 border-emerald-500/30 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      )}

      {/* LARGE Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] mt-3 w-full max-h-[70vh] overflow-y-auto bg-slate-900/98 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl shadow-2xl"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(16 185 129 / 0.5) transparent' }}
          >
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport, idx) => (
                <button
                  key={airport.code}
                  onClick={() => handleSelect(airport)}
                  className={`w-full px-6 py-5 flex items-center gap-5 hover:bg-emerald-500/15 active:bg-emerald-500/25 transition-all text-left ${idx !== filteredAirports.length - 1 ? "border-b border-white/10" : ""}`}
                >
                  <span className="text-4xl flex-shrink-0">{getFlag(airport.country)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-xl text-emerald-400">{airport.code}</span>
                      <span className="text-white font-medium text-lg truncate">{airport.city}</span>
                    </div>
                    <div className="text-sm text-gray-400 truncate">{airport.country}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No airports found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PreFlightSetup({ onTakeOff }: PreFlightSetupProps) {
  const [origin, setOrigin] = useState<Airport | null>(null)
  const [destination, setDestination] = useState<Airport | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const route = useMemo(() => {
    if (origin && destination) {
      return getRoute(origin.code, destination.code)
    }
    return null
  }, [origin, destination])

  const popularRoutes = getPopularRoutes()

  const handlePopularRoute = (routeInfo: { origin: string; destination: string }) => {
    const originAirport = AIRPORTS.find(a => a.code === routeInfo.origin)
    const destAirport = AIRPORTS.find(a => a.code === routeInfo.destination)
    if (originAirport && destAirport) {
      setOrigin(originAirport)
      setDestination(destAirport)
    }
  }

  const handleTakeOff = () => {
    if (route) {
      setIsValidating(true)
      setTimeout(() => onTakeOff(route), 800)
    }
  }

  const swapAirports = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-auto p-6">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* LARGE Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-8 text-center border-b border-white/5">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Plane className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-emerald-400">SKY</span>
              <span className="text-amber-400">HIGH</span>
            </h1>
            <p className="text-gray-400 text-lg">Flight Visualization Experience</p>
          </div>

          {/* Content - LARGE */}
          <div className="p-10 space-y-8">
            {/* Airport Selection - LARGE Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <AirportSelector
                label="From"
                value={origin}
                onChange={setOrigin}
                excludeCode={destination?.code}
              />

              <AirportSelector
                label="To"
                value={destination}
                onChange={setDestination}
                excludeCode={origin?.code}
              />
            </div>

            {/* Swap button between */}
            {(origin || destination) && (
              <div className="flex justify-center -my-4">
                <button
                  onClick={swapAirports}
                  disabled={!origin || !destination}
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 hover:border-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-5 h-5 text-white rotate-90" />
                </button>
              </div>
            )}

            {/* Route Info - LARGE */}
            <AnimatePresence mode="wait">
              {route && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="bg-gradient-to-r from-emerald-500/10 via-slate-800/50 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Flight Details</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/60 rounded-xl p-5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Distance</span>
                        </div>
                        <span className="font-mono text-3xl font-bold text-white">{formatDistance(route.distance)}</span>
                      </div>
                      <div className="bg-slate-900/60 rounded-xl p-5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-amber-400" />
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Duration</span>
                        </div>
                        <span className="font-mono text-3xl font-bold text-white">{formatDuration(route.flightDuration)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Popular Routes - LARGE buttons */}
            {!origin && !destination && (
              <div className="space-y-4">
                <span className="text-sm font-bold text-gray-500 tracking-wider uppercase">Quick Select</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {popularRoutes.slice(0, 6).map((pr) => (
                    <button
                      key={`${pr.origin}-${pr.destination}`}
                      onClick={() => handlePopularRoute(pr)}
                      className="px-5 py-4 text-sm bg-slate-800/50 border border-white/5 rounded-xl hover:border-emerald-500/30 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300">{pr.origin}</span>
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                        <span className="font-mono font-bold text-amber-400 group-hover:text-amber-300">{pr.destination}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LARGE Take Off Button */}
            <motion.button
              onClick={handleTakeOff}
              disabled={!route || isValidating}
              whileHover={{ scale: route ? 1.02 : 1 }}
              whileTap={{ scale: route ? 0.98 : 1 }}
              className={`w-full py-6 rounded-2xl font-bold text-xl tracking-wide transition-all duration-300 ${route
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer"
                : "bg-slate-800 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Plane className="w-6 h-6" />
                  </motion.div>
                  Preparing for Takeoff...
                </span>
              ) : route ? (
                <span className="flex items-center justify-center gap-3">
                  <Plane className="w-6 h-6" />
                  Board Flight • {formatDuration(route.flightDuration)}
                </span>
              ) : (
                "Select Your Route"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
