"use client"

import { motion } from "framer-motion"
import { Plane, Clock, MapPin, CheckCircle2, Sparkles, RotateCcw } from "lucide-react"
import type { Route } from "@/lib/routes-data"
import { formatDuration, formatDistance } from "@/lib/routes-data"

interface TouchdownScreenProps {
  route: Route
  focusedTime: number
  onNewFlight: () => void
}

export function TouchdownScreen({ route, focusedTime, onNewFlight }: TouchdownScreenProps) {
  const formatFlightTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#fbbf24" : "#3b82f6",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        {/* Success Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Header with celebration */}
          <div className="relative px-8 pt-10 pb-8 text-center border-b border-white/5">
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-mono text-amber-400 tracking-wider">FLIGHT COMPLETE</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Landed in {route.destination.city}
              </h1>
              <p className="text-gray-400">{route.destination.country}</p>
            </motion.div>
          </div>

          {/* Flight Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-8 space-y-6"
          >
            {/* Route display */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="font-mono text-xl font-bold text-emerald-400">{route.origin.code}</div>
                  <div className="text-xs text-gray-500 mt-1">{route.origin.city}</div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[120px] h-px bg-gradient-to-r from-emerald-500 via-white/30 to-amber-500 relative">
                    <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white rotate-90" />
                  </div>
                </div>

                <div className="text-center flex-1">
                  <div className="font-mono text-xl font-bold text-amber-400">{route.destination.code}</div>
                  <div className="text-xs text-gray-500 mt-1">{route.destination.city}</div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-500 font-mono tracking-wider">FLIGHT TIME</span>
                </div>
                <div className="font-mono text-2xl text-white">{formatFlightTime(focusedTime)}</div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-gray-500 font-mono tracking-wider">DISTANCE</span>
                </div>
                <div className="font-mono text-2xl text-white">{formatDistance(route.distance)}</div>
              </div>
            </div>

            {/* Achievement message */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-amber-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 font-medium">
                🎉 Congratulations on completing your flight!
              </p>
              <p className="text-sm text-gray-400 mt-1">
                You successfully traveled from {route.origin.city} to {route.destination.city}
              </p>
            </div>

            {/* New Flight Button */}
            <motion.button
              onClick={onNewFlight}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold tracking-wider bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              BOOK ANOTHER FLIGHT
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
