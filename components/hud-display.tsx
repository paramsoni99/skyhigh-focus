"use client"

import { motion } from "framer-motion"
import { Pause, Play, Plane, Clock, Gauge, Mountain, MapPin } from "lucide-react"
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

function StatBox({
  icon: Icon,
  label,
  value,
  unit,
  color = "emerald"
}: {
  icon: any
  label: string
  value: string | number
  unit?: string
  color?: "emerald" | "amber" | "blue"
}) {
  const colorClasses = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  }

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color]} backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color === "emerald" ? "text-emerald-400" : color === "amber" ? "text-amber-400" : "text-blue-400"}`} />
        <span className="text-[10px] font-mono text-gray-500 tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-lg text-white">{value}</span>
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
          {/* Route display */}
          <div className="flex items-center gap-4">
            {/* Origin */}
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-white">{route.origin.code}</div>
              <div className="text-xs text-gray-400 mt-0.5">{route.origin.city}</div>
            </div>

            {/* Flight path with plane */}
            <div className="relative w-48 h-8 flex items-center">
              {/* Track background */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-white/20 to-amber-500/50 rounded-full" />

              {/* Progress fill */}
              <motion.div
                className="absolute left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />

              {/* Plane icon */}
              <motion.div
                className="absolute -translate-y-1/2 top-1/2"
                style={{ left: `calc(${progress * 100}% - 10px)` }}
              >
                <div className="relative">
                  <Plane className="w-5 h-5 text-white rotate-90 drop-shadow-lg" />
                  <div className="absolute inset-0 animate-ping">
                    <Plane className="w-5 h-5 text-emerald-400/50 rotate-90" />
                  </div>
                </div>
              </motion.div>

              {/* Departure dot */}
              <div className="absolute left-0 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2" />

              {/* Arrival dot */}
              <div className="absolute right-0 w-2 h-2 rounded-full bg-amber-400 translate-x-1/2" />
            </div>

            {/* Destination */}
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-white">{route.destination.code}</div>
              <div className="text-xs text-gray-400 mt-0.5">{route.destination.city}</div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="text-center mt-3">
            <span className="font-mono text-sm text-emerald-400">{Math.round(progress * 100)}%</span>
            <span className="text-xs text-gray-500 ml-2">complete</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Panel - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 space-y-3"
      >
        <StatBox
          icon={Clock}
          label="ELAPSED"
          value={formatTime(timeElapsed)}
          color="emerald"
        />
        <StatBox
          icon={Clock}
          label="REMAINING"
          value={formatTime(timeRemaining)}
          color="amber"
        />
        <StatBox
          icon={MapPin}
          label="COVERED"
          value={Math.round(distanceCovered).toLocaleString()}
          unit="km"
          color="blue"
        />
      </motion.div>

      {/* Stats Panel - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 space-y-3"
      >
        <StatBox
          icon={Mountain}
          label="ALTITUDE"
          value={Math.round(altitude).toLocaleString()}
          unit="ft"
          color="emerald"
        />
        <StatBox
          icon={Gauge}
          label="SPEED"
          value={groundSpeed}
          unit="km/h"
          color="amber"
        />
        <StatBox
          icon={MapPin}
          label="REMAINING"
          value={Math.round(distanceRemaining).toLocaleString()}
          unit="km"
          color="blue"
        />
      </motion.div>

      {/* Bottom Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          {/* Progress bar */}
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>

          {/* Time info */}
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-400">{formatTime(timeElapsed)}</span>
            <span className="text-gray-500">
              {formatDistance(route.distance)} • {formatDuration(route.flightDuration)}
            </span>
            <span className="text-amber-400">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </motion.div>

      {/* Pause Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={onPauseToggle}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/80 transition-colors"
      >
        {isPaused ? (
          <Play className="w-5 h-5 text-emerald-400" />
        ) : (
          <Pause className="w-5 h-5 text-amber-400" />
        )}
      </motion.button>
    </>
  )
}
