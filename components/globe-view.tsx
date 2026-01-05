"use client"

import { useEffect, useRef } from "react"
import type { Route } from "@/lib/routes-data"
import { generateGreatCirclePoints } from "@/lib/routes-data"

interface GlobeViewProps {
  route: Route
  planeProgress: number
}

export function GlobeView({ route, planeProgress }: GlobeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2.5

    // Clear with cockpit background
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, width, height)

    // Draw globe
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)"
    ctx.strokeStyle = "rgba(0, 255, 0, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Draw grid
    ctx.strokeStyle = "rgba(0, 255, 0, 0.08)"
    ctx.lineWidth = 1
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = centerY + (lat / 90) * radius
      ctx.beginPath()
      ctx.moveTo(centerX - radius, y)
      ctx.lineTo(centerX + radius, y)
      ctx.stroke()
    }

    for (let lng = -180; lng <= 180; lng += 20) {
      const x = centerX + (lng / 180) * radius
      ctx.beginPath()
      ctx.movePath = centerX + (lng / 180) * radius
      ctx.moveTo(x, centerY - radius)
      ctx.lineTo(x, centerY + radius)
      ctx.stroke()
    }

    // Draw route arc
    const routePoints = generateGreatCirclePoints(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng,
      150,
    )

    ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()

    routePoints.forEach((point, index) => {
      const [lat, lng] = point
      const x = centerX + (lng / 180) * radius
      const y = centerY - (lat / 90) * radius

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw origin airport
    const originX = centerX + (route.origin.lng / 180) * radius
    const originY = centerY - (route.origin.lat / 90) * radius

    ctx.fillStyle = "rgba(251, 191, 36, 0.8)"
    ctx.beginPath()
    ctx.arc(originX, originY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "rgba(251, 191, 36, 0.5)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(originX, originY, 12, 0, Math.PI * 2)
    ctx.stroke()

    // Draw destination airport
    const destX = centerX + (route.destination.lng / 180) * radius
    const destY = centerY - (route.destination.lat / 90) * radius

    ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
    ctx.beginPath()
    ctx.arc(destX, destY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(destX, destY, 12, 0, Math.PI * 2)
    ctx.stroke()

    // Draw plane on route
    const planePoint = routePoints[Math.floor(planeProgress * (routePoints.length - 1))]
    if (planePoint) {
      const [lat, lng] = planePoint
      const planeX = centerX + (lng / 180) * radius
      const planeY = centerY - (lat / 90) * radius

      // Plane glow
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)"
      ctx.beginPath()
      ctx.arc(planeX, planeY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Plane icon
      ctx.fillStyle = "#00ff00"
      ctx.beginPath()
      ctx.moveTo(planeX, planeY - 8)
      ctx.lineTo(planeX + 6, planeY + 6)
      ctx.lineTo(planeX, planeY + 4)
      ctx.lineTo(planeX - 6, planeY + 6)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [route, planeProgress])

  return <canvas ref={canvasRef} width={800} height={600} className="w-full h-full max-w-4xl mx-auto" />
}
