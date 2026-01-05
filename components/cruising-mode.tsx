"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HUDDisplay } from "./hud-display"
import { FlightRadarGlobe } from "./flight-radar-globe"
import type { Route } from "@/lib/routes-data"

interface CruisingModeProps {
  route: Route
  onComplete: (completionData: { route: Route; focusedTime: number }) => void
}

export function CruisingMode({ route, onComplete }: CruisingModeProps) {
  // Use the actual flight duration from the route
  const totalSeconds = route.flightDuration * 60
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [planeProgress, setPlaneProgress] = useState(0)
  const [altitude, setAltitude] = useState(0)
  const [groundSpeed, setGroundSpeed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Main timer and plane animation loop - synced to flight duration
  useEffect(() => {
    if (isComplete || isPaused) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1

        // Calculate progress (0 to 1) based on elapsed time
        const progress = Math.min(newTime / totalSeconds, 1)
        setPlaneProgress(progress)

        // Calculate altitude with realistic flight phases
        let altitudeValue = 0
        let speedValue = 0

        if (progress < 0.08) {
          // Takeoff & climb phase: 0-8%
          const climbProgress = progress / 0.08
          altitudeValue = climbProgress * 35000
          speedValue = 200 + climbProgress * 670 // Accelerate from 200 to 870 km/h
        } else if (progress < 0.92) {
          // Cruise phase: 8-92%
          altitudeValue = 35000 + Math.sin(((progress - 0.08) / 0.84) * Math.PI * 2) * 2000
          speedValue = 850 + Math.random() * 40 // Cruise around 870 km/h with slight variation
        } else {
          // Descent & landing phase: 92-100%
          const descentProgress = (progress - 0.92) / 0.08
          altitudeValue = Math.max(0, 35000 * (1 - descentProgress))
          speedValue = 870 - descentProgress * 600 // Decelerate to 270 km/h
        }

        setAltitude(altitudeValue)
        setGroundSpeed(Math.round(speedValue))

        // Check if flight completed
        if (newTime >= totalSeconds) {
          setIsComplete(true)
          setTimeout(() => {
            onComplete({
              route,
              focusedTime: totalSeconds,
            })
          }, 1500) // Delay for landing animation
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isComplete, isPaused, totalSeconds, route, onComplete])

  const timeRemaining = Math.max(0, totalSeconds - timeElapsed)
  const distanceCovered = route.distance * planeProgress
  const distanceRemaining = route.distance - distanceCovered

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{ backgroundPosition: ["0 0", "60px 60px"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.15)_1px,transparent_1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />

      {/* Globe Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <FlightRadarGlobe
            route={route}
            planeProgress={planeProgress}
            isPaused={isPaused}
            currentAltitude={altitude}
          />
        </motion.div>
      </div>

      {/* HUD Overlay */}
      <HUDDisplay
        route={route}
        timeElapsed={timeElapsed}
        timeRemaining={timeRemaining}
        totalDuration={totalSeconds}
        altitude={altitude}
        groundSpeed={groundSpeed}
        distanceCovered={distanceCovered}
        distanceRemaining={distanceRemaining}
        progress={planeProgress}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
      />

      {/* Flight phase indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 px-4 py-2 bg-slate-900/80 backdrop-blur-lg border border-emerald-500/20 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
          <span className="text-xs font-mono text-gray-400 tracking-wider">
            {isPaused ? "PAUSED" : planeProgress < 0.08 ? "CLIMBING" : planeProgress > 0.92 ? "DESCENDING" : "CRUISING"}
          </span>
        </div>
      </motion.div>

      {/* Completion overlay */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              ✈️
            </motion.div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">LANDED</h2>
            <p className="text-gray-400">{route.destination.city}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
