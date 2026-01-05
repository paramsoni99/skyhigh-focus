"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HUDDisplay } from "./hud-display"
import { FlightRadarGlobe } from "./flight-radar-globe"
import type { Route } from "@/lib/routes-data"
import { Plane } from "lucide-react"

interface CruisingModeProps {
  route: Route
  onComplete: (completionData: { route: Route; focusedTime: number }) => void
}

export function CruisingMode({ route, onComplete }: CruisingModeProps) {
  const totalSeconds = route.flightDuration * 60
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [planeProgress, setPlaneProgress] = useState(0)
  const [altitude, setAltitude] = useState(0)
  const [groundSpeed, setGroundSpeed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showBoarding, setShowBoarding] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Hydration fix
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Boarding screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoarding(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Flight timer
  useEffect(() => {
    if (!isClient || isComplete || isPaused || showBoarding) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        const progress = Math.min(newTime / totalSeconds, 1)
        setPlaneProgress(progress)

        // Calculate altitude and speed based on progress
        let alt = 0
        let speed = 0

        if (progress < 0.03) {
          // Takeoff
          const t = progress / 0.03
          alt = t * 5000
          speed = 150 + t * 150
        } else if (progress < 0.12) {
          // Climb
          const t = (progress - 0.03) / 0.09
          alt = 5000 + t * 30000
          speed = 300 + t * 570
        } else if (progress < 0.88) {
          // Cruise
          const t = (progress - 0.12) / 0.76
          alt = 35000 + Math.sin(t * Math.PI * 2) * 2000
          speed = 850 + Math.sin(t * 10) * 30
        } else if (progress < 0.97) {
          // Descent
          const t = (progress - 0.88) / 0.09
          alt = 35000 - t * 30000
          speed = 870 - t * 400
        } else {
          // Landing
          const t = (progress - 0.97) / 0.03
          alt = Math.max(0, 5000 - t * 5000)
          speed = Math.max(150, 470 - t * 320)
        }

        setAltitude(alt)
        setGroundSpeed(Math.round(speed))

        if (newTime >= totalSeconds) {
          setIsComplete(true)
          setTimeout(() => {
            onComplete({ route, focusedTime: totalSeconds })
          }, 2500)
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isClient, isComplete, isPaused, showBoarding, totalSeconds, route, onComplete])

  const timeRemaining = Math.max(0, totalSeconds - timeElapsed)
  const distanceCovered = route.distance * planeProgress
  const distanceRemaining = route.distance - distanceCovered

  if (!isClient) {
    return <div className="fixed inset-0 bg-slate-950" />
  }

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(16,185,129,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.5)_1px,transparent_1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Boarding Screen */}
      <AnimatePresence>
        {showBoarding && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Plane className="w-16 h-16 text-emerald-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {route.origin.code} → {route.destination.code}
              </h2>
              <p className="text-gray-400 mb-6">
                {route.origin.city} to {route.destination.city}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2 }}
                className="h-1 w-64 mx-auto bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full origin-left"
              />
              <p className="text-emerald-400 text-sm mt-4 font-mono">
                Preparing for takeoff...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Globe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showBoarding ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <FlightRadarGlobe
          route={route}
          planeProgress={planeProgress}
          isPaused={isPaused}
          currentAltitude={altitude}
        />
      </motion.div>

      {/* HUD */}
      {!showBoarding && (
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
      )}

      {/* Completion Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-7xl mb-6"
              >
                🛬
              </motion.div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">
                Landed Successfully
              </h2>
              <p className="text-xl text-white">{route.destination.city}</p>
              <p className="text-gray-400">{route.destination.country}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
