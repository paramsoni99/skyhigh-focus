"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Search, MapPin, Clock, Navigation, ChevronDown, Sparkles } from "lucide-react"
import { AIRPORTS, getRoute, formatDuration, formatDistance, getPopularRoutes, type Airport, type Route } from "@/lib/routes-data"

interface PreFlightSetupProps {
  onTakeOff: (route: Route) => void
}

// Airport Selector Component
function AirportSelector({
  label,
  placeholder,
  value,
  onChange,
  excludeCode,
}: {
  label: string
  placeholder: string
  value: Airport | null
  onChange: (airport: Airport) => void
  excludeCode?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter airports based on search
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

    return airports.slice(0, 10) // Limit results
  }, [search, excludeCode])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
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
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-xs font-mono tracking-widest text-amber-400/80">{label}</label>

      {/* Selected Airport Display or Search Input */}
      <div className="relative">
        {value && !isOpen ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="w-full px-4 py-4 bg-black/40 border border-emerald-500/30 rounded-lg text-left hover:border-emerald-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="font-mono font-bold text-emerald-400">{value.code}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">{value.city}</div>
                <div className="text-sm text-gray-400">{value.country}</div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
            </div>
          </motion.button>
        ) : (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-4 font-mono text-sm bg-black/40 border border-emerald-500/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>
        )}

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-lg shadow-2xl"
            >
              {filteredAirports.length > 0 ? (
                filteredAirports.map((airport) => (
                  <button
                    key={airport.code}
                    onClick={() => handleSelect(airport)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-500/10 transition-colors text-left border-b border-white/5 last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="font-mono font-bold text-sm text-emerald-400">{airport.code}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{airport.city}</div>
                      <div className="text-xs text-gray-400 truncate">{airport.country}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No airports found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PreFlightSetup({ onTakeOff }: PreFlightSetupProps) {
  const [origin, setOrigin] = useState<Airport | null>(null)
  const [destination, setDestination] = useState<Airport | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Calculate route when both airports are selected
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
      setTimeout(() => {
        onTakeOff(route)
      }, 800)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.1)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-500/5 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Plane className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-emerald-400">SKY</span>
                <span className="text-amber-400">HIGH</span>
              </h1>
            </div>
            <p className="text-center text-sm text-gray-400 tracking-wide">
              SELECT YOUR FLIGHT ROUTE
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Airport Selection */}
            <div className="space-y-4">
              <AirportSelector
                label="DEPARTURE"
                placeholder="Search departure city or airport..."
                value={origin}
                onChange={setOrigin}
                excludeCode={destination?.code}
              />

              {/* Arrow between selectors */}
              <div className="flex justify-center py-1">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-slate-800 border border-emerald-500/30 flex items-center justify-center"
                >
                  <Navigation className="w-5 h-5 text-emerald-400 rotate-180" />
                </motion.div>
              </div>

              <AirportSelector
                label="ARRIVAL"
                placeholder="Search arrival city or airport..."
                value={destination}
                onChange={setDestination}
                excludeCode={origin?.code}
              />
            </div>

            {/* Route Info */}
            <AnimatePresence>
              {route && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-amber-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono text-gray-400 tracking-wider">FLIGHT INFO</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-gray-500">DISTANCE</span>
                        </div>
                        <span className="font-mono text-lg text-white">{formatDistance(route.distance)}</span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-xs text-gray-500">DURATION</span>
                        </div>
                        <span className="font-mono text-lg text-white">{formatDuration(route.flightDuration)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Popular Routes */}
            {!origin && !destination && (
              <div className="space-y-3">
                <span className="text-xs font-mono text-gray-500 tracking-wider">POPULAR ROUTES</span>
                <div className="flex flex-wrap gap-2">
                  {popularRoutes.slice(0, 4).map((pr) => (
                    <button
                      key={`${pr.origin}-${pr.destination}`}
                      onClick={() => handlePopularRoute(pr)}
                      className="px-3 py-1.5 text-xs font-mono bg-slate-800/50 border border-white/10 rounded-full hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-gray-300"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Take Off Button */}
            <motion.button
              onClick={handleTakeOff}
              disabled={!route || isValidating}
              whileHover={{ scale: route ? 1.02 : 1 }}
              whileTap={{ scale: route ? 0.98 : 1 }}
              className={`w-full py-4 rounded-xl font-bold tracking-wider transition-all duration-300 ${route
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 cursor-pointer"
                  : "bg-slate-800 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Plane className="w-5 h-5" />
                  </motion.div>
                  PREPARING FOR TAKEOFF...
                </span>
              ) : route ? (
                <span className="flex items-center justify-center gap-2">
                  <Plane className="w-5 h-5" />
                  BOARD FLIGHT • {formatDuration(route.flightDuration)}
                </span>
              ) : (
                "SELECT YOUR ROUTE"
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6">
            <p className="text-center text-xs text-gray-600">
              Your flight will be visualized in real-time across the globe
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
