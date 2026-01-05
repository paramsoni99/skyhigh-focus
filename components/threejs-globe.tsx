"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import type { Route } from "@/lib/routes-data"
import { generateGreatCirclePoints } from "@/lib/routes-data"

interface ThreeJSGlobeProps {
  route: Route
  planeProgress: number
  isPaused?: boolean
}

export function ThreeJSGlobe({ route, planeProgress, isPaused }: ThreeJSGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const planeRef = useRef<THREE.Mesh | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0f172a)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    cameraRef.current = camera
    camera.position.z = 2.5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererRef.current = renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Create globe sphere with atmosphere
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64)

    // Create globe material with gradient
    const canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 1024

    const ctx = canvas.getContext("2d")!
    // Ocean blue gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, "#1a3a52")
    oceanGradient.addColorStop(0.5, "#0f172a")
    oceanGradient.addColorStop(1, "#051424")

    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add continents (simplified landmasses)
    ctx.fillStyle = "#1f4d2f"
    // North America
    ctx.fillRect(100, 200, 200, 150)
    // South America
    ctx.fillRect(200, 350, 100, 150)
    // Europe
    ctx.fillRect(700, 150, 150, 120)
    // Africa
    ctx.fillRect(850, 250, 150, 250)
    // Asia
    ctx.fillRect(1100, 150, 400, 300)
    // Australia
    ctx.fillRect(1400, 500, 100, 100)

    // Add grid lines
    ctx.strokeStyle = "rgba(0, 255, 0, 0.08)"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 256) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 128) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x0a4d2f,
      emissiveIntensity: 0.2,
      shininess: 5,
    })

    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    globeRef.current = globe
    scene.add(globe)

    // Add glow effect to globe
    const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glow)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(2, 2, 2)
    scene.add(directionalLight)

    // Add a greenish point light for cockpit aesthetic
    const pointLight = new THREE.PointLight(0x00ff00, 0.3)
    pointLight.position.set(-2, 1, 2)
    scene.add(pointLight)

    // Create route arc
    const routePoints = generateGreatCirclePoints(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng,
      150,
    )

    const points3D = routePoints.map(([lat, lng]) => {
      const phi = ((90 - lat) * Math.PI) / 180
      const theta = ((lng + 180) * Math.PI) / 180
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)
      return new THREE.Vector3(x, y, z)
    })

    const routeCurve = new THREE.CatmullRomCurve3(points3D)
    const routePoints3D = routeCurve.getPoints(150)
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints3D)
    const routeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
      opacity: 0.7,
      transparent: true,
    })
    const routeLine = new THREE.Line(routeGeometry, routeMaterial)
    scene.add(routeLine)

    // Create plane marker
    const planeGeometry = new THREE.SphereGeometry(0.02, 16, 16)
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    planeRef.current = plane
    scene.add(plane)

    // Add plane trail
    const trailGeometry = new THREE.BufferGeometry()
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.3,
      transparent: true,
    })
    const trail = new THREE.Line(trailGeometry, trailMaterial)
    scene.add(trail)

    // Origin and destination airport markers
    const createAirportMarker = (lat: number, lng: number, color: number) => {
      const phi = ((90 - lat) * Math.PI) / 180
      const theta = ((lng + 180) * Math.PI) / 180
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)

      const markerGeometry = new THREE.SphereGeometry(0.025, 12, 12)
      const markerMaterial = new THREE.MeshBasicMaterial({ color })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      scene.add(marker)

      // Add glow ring around airport
      const ringGeometry = new THREE.TorusGeometry(0.04, 0.003, 8, 12)
      const ringMaterial = new THREE.MeshBasicMaterial({ color, wireframe: false })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.set(x, y, z)
      scene.add(ring)
    }

    createAirportMarker(route.origin.lat, route.origin.lng, 0xfbbf24) // Amber
    createAirportMarker(route.destination.lat, route.destination.lng, 0x00ff00) // Green

    setIsInitialized(true)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate globe
      if (globe) {
        globe.rotation.y += 0.0001
      }

      // Update plane position
      if (plane && planeRef.current) {
        const planePoint = points3D[Math.floor(planeProgress * (points3D.length - 1))]
        if (planePoint) {
          plane.position.copy(planePoint)

          // Rotate plane to face direction
          if (points3D.length > 1) {
            const nextIdx = Math.min(Math.floor(planeProgress * (points3D.length - 1)) + 1, points3D.length - 1)
            const nextPoint = points3D[nextIdx]
            const direction = new THREE.Vector3().subVectors(nextPoint, planePoint).normalize()
            plane.lookAt(plane.position.clone().add(direction))
          }
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isInitialized, planeProgress, route])

  return <div ref={containerRef} className="w-full h-full" />
}
