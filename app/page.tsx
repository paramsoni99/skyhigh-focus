"use client"

import { useState } from "react"
import { PreFlightSetup } from "@/components/pre-flight-setup"
import { CruisingMode } from "@/components/cruising-mode"
import { TouchdownScreen } from "@/components/touchdown-screen"
import type { Route } from "@/lib/routes-data"

type AppState = "pre-flight" | "cruising" | "touchdown"

interface FlightSession {
  route: Route
  focusedTime: number
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("pre-flight")
  const [currentSession, setCurrentSession] = useState<FlightSession | null>(null)

  const handleTakeOff = (route: Route) => {
    setCurrentSession({
      route,
      focusedTime: 0,
    })
    setAppState("cruising")
  }

  const handleComplete = (completionData: {
    route: Route
    focusedTime: number
  }) => {
    setCurrentSession((prev) =>
      prev
        ? {
          ...prev,
          focusedTime: completionData.focusedTime,
        }
        : null,
    )
    setAppState("touchdown")
  }

  const handleNewFlight = () => {
    setAppState("pre-flight")
    setCurrentSession(null)
  }

  return (
    <main className="w-full h-screen bg-slate-950 overflow-hidden">
      {appState === "pre-flight" && <PreFlightSetup onTakeOff={handleTakeOff} />}

      {appState === "cruising" && currentSession && (
        <CruisingMode
          route={currentSession.route}
          onComplete={handleComplete}
        />
      )}

      {appState === "touchdown" && currentSession && (
        <TouchdownScreen
          route={currentSession.route}
          focusedTime={currentSession.focusedTime}
          onNewFlight={handleNewFlight}
        />
      )}
    </main>
  )
}
