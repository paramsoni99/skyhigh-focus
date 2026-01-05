"use client"

import { motion } from "framer-motion"
import { Pause, Play, Plane, Clock, Gauge, Mountain, MapPin, Compass } from "lucide-react"
import type { Route } from "@/lib/routes-data"
import { formatDuration, formatDistance } from "@/lib/routes-data"

interface HUDDisplayProps {
  route: Route
  timeElapsed: number
  timeRemaining: number
  totalDuration: number
  altitude: number
  groundSpeed: number
  distanceCovered: number
  distanceRemaining: number
  progress: number
  isPaused: boolean
  onPauseToggle: () => void
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "emerald",
  size = "normal"
}: {
  icon: React.ElementType
  label: string
  value: string | number
  unit?: string
  color?: "emerald" | "amber" | "blue" | "white"
  size?: "normal" | "large"
}) {
  const colorStyles = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    white: "text-white border-white/10 bg-white/5",
  }

  const iconColors = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    blue: "text-blue-400",
    white: "text-white",
  }

  return (
    <div className={`rounded-xl border backdrop-blur-md ${colorStyles[color]} ${size === "large" ? "px-5 py-4" : "px-4 py-3"}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${iconColors[color]}`} />
        <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-mono font-semibold text-white ${size === "large" ? "text-2xl" : "text-lg"}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs text-gray-500 font-mono">{unit}</span>}
      </div>
    </div>
  )
}

export function HUDDisplay({
  route,
  timeElapsed,
  timeRemaining,
  totalDuration,
  altitude,
  groundSpeed,
  distanceCovered,
  distanceRemaining,
  progress,
  isPaused,
  onPauseToggle,
}: HUDDisplayProps) {
  return (
    <>
      {/* Top Route Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-5 shadow-2xl shadow-black/20">
          {/* Route display */}
          <div className="flex items-center gap-6">
            {/* Origin */}
            <div className="text-center min-w-[80px]">
              <motion.div
                className="font-mono text-3xl font-bold text-emerald-400"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {route.origin.code}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1 truncate max-w-[100px]">{route.origin.city}</div>
            </div>

            {/* Flight path with animated plane */}
            <div className="relative w-56 h-10 flex items-center">
              {/* Track background */}
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/40 via-white/20 to-amber-500/40 rounded-full" />

              {/* Progress fill with glow */}
              <motion.div
                className="absolute left-0 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                style={{ width: `${progress * 100}%` }}
              />
              <motion.div
                className="absolute left-0 h-[6px] -top-[2px] rounded-full bg-gradient-to-r from-emerald-400/50 to-emerald-500/50 blur-sm"
                style={{ width: `${progress * 100}%` }}
              />

              {/* Animated plane icon */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-10"
                style={{ left: `calc(${Math.min(progress * 100, 95)}% - 12px)` }}
                animate={{ y: ["-50%", "-55%", "-50%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  <Plane className="w-6 h-6 text-white rotate-90 drop-shadow-lg" fill="currentColor" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Plane className="w-6 h-6 text-emerald-400/60 rotate-90 blur-[2px]" fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Endpoint dots */}
              <div className="absolute left-0 w-3 h-3 rounded-full bg-emerald-400 -translate-x-1/2 shadow-lg shadow-emerald-500/50" />
              <div className="absolute right-0 w-3 h-3 rounded-full bg-amber-400 translate-x-1/2 shadow-lg shadow-amber-500/50" />
            </div>

            {/* Destination */}
            <div className="text-center min-w-[80px]">
              <motion.div
                className="font-mono text-3xl font-bold text-amber-400"
                animate={{ opacity: progress > 0.9 ? [1, 0.7, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {route.destination.code}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1 truncate max-w-[100px]">{route.destination.city}</div>
            </div>
          </div>

          {/* Progress info */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5">
            <span className="font-mono text-sm text-emerald-400">{Math.round(progress * 100)}%</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{formatDistance(route.distance)}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{formatDuration(route.flightDuration)} total</span>
          </div>
        </div>
      </motion.div>

      {/* Left Stats Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 space-y-3"
      >
        <StatCard
          icon={Clock}
          label="Elapsed"
          value={formatTime(timeElapsed)}
          color="emerald"
        />
        <StatCard
          icon={Clock}
          label="Remaining"
          value={formatTime(timeRemaining)}
          color="amber"
        />
        <StatCard
          icon={Compass}
          label="Covered"
          value={Math.round(distanceCovered)}
          unit="km"
          color="blue"
        />
      </motion.div>

      {/* Right Stats Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 space-y-3"
      >
        <StatCard
          icon={Mountain}
          label="Altitude"
          value={Math.round(altitude)}
          unit="ft"
          color="emerald"
        />
        <StatCard
          icon={Gauge}
          label="Speed"
          value={groundSpeed}
          unit="km/h"
          color="amber"
        />
        <StatCard
          icon={MapPin}
          label="To Go"
          value={Math.round(distanceRemaining)}
          unit="km"
          color="blue"
        />
      </motion.div>

      {/* Bottom Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6"
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-5">
          {/* Progress bar */}
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 w-full"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
          </div>

          {/* Time labels */}
          <div className="flex justify-between items-center text-sm font-mono">
            <div className="text-emerald-400">
              <span className="text-gray-500 text-xs mr-2">ELAPSED</span>
              {formatTime(timeElapsed)}
            </div>
            <div className="text-center text-gray-400 text-xs">
              {isPaused ? (
                <span className="text-amber-400 animate-pulse">⏸ PAUSED</span>
              ) : (
                <span>{Math.round(progress * 100)}% Complete</span>
              )}
            </div>
            <div className="text-amber-400">
              {formatTime(timeRemaining)}
              <span className="text-gray-500 text-xs ml-2">REMAINING</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pause Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={onPauseToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors shadow-xl"
      >
        {isPaused ? (
          <Play className="w-6 h-6 text-emerald-400" fill="currentColor" />
        ) : (
          <Pause className="w-6 h-6 text-amber-400" fill="currentColor" />
        )}
      </motion.button>
    </>
  )
}
