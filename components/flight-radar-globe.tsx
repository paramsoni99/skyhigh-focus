"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import type { Route } from "@/lib/routes-data"
import { generateGreatCirclePoints } from "@/lib/routes-data"

interface FlightRadarGlobeProps {
  route: Route
  planeProgress: number
  isPaused?: boolean
  currentAltitude?: number
}

export function FlightRadarGlobe({ route, planeProgress, isPaused, currentAltitude = 35000 }: FlightRadarGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const planeRef = useRef<THREE.Group | null>(null)
  const trailLineRef = useRef<THREE.Line | null>(null)
  const routePointsRef = useRef<THREE.Vector3[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x030712)

    // Camera setup with better positioning for route viewing
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000)
    cameraRef.current = camera
    camera.position.set(0, 1.2, 3)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    rendererRef.current = renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Create Earth sphere with high-quality procedural texture
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128)

    // Create detailed Earth texture
    const canvas = document.createElement("canvas")
    canvas.width = 4096
    canvas.height = 2048
    const ctx = canvas.getContext("2d")!

    // Deep ocean gradient
    const oceanGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    )
    oceanGradient.addColorStop(0, "#0c4a6e")
    oceanGradient.addColorStop(0.5, "#082f49")
    oceanGradient.addColorStop(1, "#0c0a09")
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Land masses with more detail
    const drawContinent = (
      points: [number, number][],
      baseColor: string,
      highlightColor: string
    ) => {
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
      }
      ctx.closePath()

      const gradient = ctx.createLinearGradient(
        points[0][0], points[0][1],
        points[points.length - 1][0], points[points.length - 1][1]
      )
      gradient.addColorStop(0, baseColor)
      gradient.addColorStop(1, highlightColor)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Continents with improved shapes
    // North America
    drawContinent([
      [150, 280], [350, 250], [380, 320], [350, 420], [280, 480], [180, 450], [120, 380]
    ], "#1a4d2e", "#0f3d24")

    // South America
    drawContinent([
      [300, 520], [380, 500], [400, 600], [350, 750], [280, 780], [260, 650]
    ], "#1a4d2e", "#155d34")

    // Europe
    drawContinent([
      [900, 200], [1100, 180], [1150, 280], [1050, 340], [920, 320], [870, 260]
    ], "#1a4d2e", "#124d26")

    // Africa
    drawContinent([
      [920, 380], [1100, 350], [1180, 500], [1100, 720], [950, 700], [880, 550], [900, 420]
    ], "#1a4d2e", "#0f4020")

    // Asia
    drawContinent([
      [1200, 180], [1700, 150], [1900, 300], [1800, 480], [1500, 520], [1250, 450], [1150, 300]
    ], "#1a4d2e", "#155d34")

    // India subcontinent
    drawContinent([
      [1350, 460], [1450, 420], [1500, 520], [1420, 620], [1340, 580]
    ], "#1a5735", "#0f4020")

    // Australia
    drawContinent([
      [1700, 620], [1900, 600], [1950, 720], [1850, 800], [1700, 780], [1650, 700]
    ], "#1a4d2e", "#124d26")

    // Add subtle grid lines
    ctx.strokeStyle = "rgba(16, 185, 129, 0.08)"
    ctx.lineWidth = 1

    // Longitude lines
    for (let i = 0; i <= canvas.width; i += 256) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Latitude lines
    for (let i = 0; i <= canvas.height; i += 128) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Equator highlight
    ctx.strokeStyle = "rgba(16, 185, 129, 0.15)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5,
      emissive: 0x0a2e1f,
      emissiveIntensity: 0.3,
    })

    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.castShadow = true
    earth.receiveShadow = true
    globeRef.current = earth
    scene.add(earth)

    // Atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(1.015, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.06,
    })
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowSphere)

    // Outer atmosphere halo
    const haloGeometry = new THREE.SphereGeometry(1.03, 64, 64)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    })
    const haloSphere = new THREE.Mesh(haloGeometry, haloMaterial)
    scene.add(haloSphere)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8)
    sunLight.position.set(5, 3, 5)
    sunLight.castShadow = true
    scene.add(sunLight)

    // Subtle blue rim light
    const rimLight = new THREE.PointLight(0x3b82f6, 0.3)
    rimLight.position.set(-3, 0, -3)
    scene.add(rimLight)

    // Generate flight route
    const routePoints = generateGreatCirclePoints(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng,
      200,
    )

    // Convert to 3D points with slight elevation
    const points3D = routePoints.map(([lat, lng]) => {
      const latRad = (lat * Math.PI) / 180
      const lngRad = (lng * Math.PI) / 180
      const radius = 1.02 // Slightly above Earth surface
      const x = radius * Math.cos(latRad) * Math.cos(lngRad)
      const y = radius * Math.sin(latRad)
      const z = radius * Math.cos(latRad) * Math.sin(lngRad)
      return new THREE.Vector3(x, y, z)
    })
    routePointsRef.current = points3D

    // Create flight route line with gradient effect
    const routeCurve = new THREE.CatmullRomCurve3(points3D)
    const routePoints3D = routeCurve.getPoints(200)
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints3D)

    // Create gradient colors for route
    const colors = []
    for (let i = 0; i < routePoints3D.length; i++) {
      const t = i / routePoints3D.length
      // Gradient from emerald to amber
      const r = 0.063 + t * 0.92
      const g = 0.725 - t * 0.28
      const b = 0.506 - t * 0.36
      colors.push(r, g, b)
    }
    routeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const routeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
      opacity: 0.7,
      transparent: true,
    })
    const routeLine = new THREE.Line(routeGeometry, routeMaterial)
    scene.add(routeLine)

    // Create dashed route preview
    const dashedRouteMaterial = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 0.02,
      gapSize: 0.01,
      opacity: 0.3,
      transparent: true,
    })
    const dashedRouteLine = new THREE.Line(routeGeometry.clone(), dashedRouteMaterial)
    dashedRouteLine.computeLineDistances()
    scene.add(dashedRouteLine)

    // Create aircraft group
    const aircraftGroup = new THREE.Group()
    planeRef.current = aircraftGroup
    scene.add(aircraftGroup)

    // Aircraft body (cone + cylinder)
    const bodyGeometry = new THREE.ConeGeometry(0.008, 0.035, 8)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.rotation.x = Math.PI / 2
    aircraftGroup.add(body)

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.05, 0.002, 0.012)
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x10b981,
      emissiveIntensity: 0.3,
    })
    const wings = new THREE.Mesh(wingGeometry, wingMaterial)
    wings.position.z = -0.005
    aircraftGroup.add(wings)

    // Glow effect around aircraft
    const glowGeo = new THREE.SphereGeometry(0.02, 16, 16)
    const aircraftGlowMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.4,
    })
    const aircraftGlow = new THREE.Mesh(glowGeo, aircraftGlowMat)
    aircraftGroup.add(aircraftGlow)

    // Create trail line
    const trailGeometry = new THREE.BufferGeometry()
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      opacity: 0.7,
      transparent: true,
    })
    const trailLine = new THREE.Line(trailGeometry, trailMaterial)
    trailLineRef.current = trailLine
    scene.add(trailLine)

    // Airport markers
    const createAirportMarker = (lat: number, lng: number, code: string, isDestination: boolean) => {
      const latRad = (lat * Math.PI) / 180
      const lngRad = (lng * Math.PI) / 180
      const x = Math.cos(latRad) * Math.cos(lngRad)
      const y = Math.sin(latRad)
      const z = Math.cos(latRad) * Math.sin(lngRad)

      // Main marker sphere
      const markerGeometry = new THREE.SphereGeometry(0.018, 24, 24)
      const markerColor = isDestination ? 0xfbbf24 : 0x10b981
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: markerColor,
        emissive: markerColor,
        emissiveIntensity: 0.8,
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      scene.add(marker)

      // Pulse ring
      const ringGeometry = new THREE.TorusGeometry(0.04, 0.002, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.6,
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.set(x, y, z)
      ring.lookAt(0, 0, 0)
      ring.userData.pulsePhase = isDestination ? 0 : Math.PI
      scene.add(ring)

      // Vertical beam
      const beamGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.15, 8)
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.3,
      })
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      const beamOffset = new THREE.Vector3(x, y, z).multiplyScalar(1.075)
      beam.position.copy(beamOffset)
      beam.lookAt(0, 0, 0)
      beam.rotateX(Math.PI / 2)
      scene.add(beam)
    }

    createAirportMarker(route.origin.lat, route.origin.lng, route.origin.code, false)
    createAirportMarker(route.destination.lat, route.destination.lng, route.destination.code, true)

    // Position camera to view the route
    const midLat = (route.origin.lat + route.destination.lat) / 2
    const midLng = (route.origin.lng + route.destination.lng) / 2
    const midLatRad = (midLat * Math.PI) / 180
    const midLngRad = (midLng * Math.PI) / 180
    const camX = 2.8 * Math.cos(midLatRad) * Math.cos(midLngRad)
    const camY = 2.8 * Math.sin(midLatRad) + 0.8
    const camZ = 2.8 * Math.cos(midLatRad) * Math.sin(midLngRad)
    camera.position.set(camX, camY, camZ)
    camera.lookAt(0, 0, 0)

    setIsInitialized(true)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      if (earth) {
        earth.rotation.y += deltaX * 0.005
        earth.rotation.x += deltaY * 0.005
        earth.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, earth.rotation.x))
      }

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const scale = e.deltaY > 0 ? 1.05 : 0.95
      camera.position.multiplyScalar(scale)
      camera.position.clampLength(2, 5)
    }

    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("mouseleave", handleMouseUp)
    container.addEventListener("wheel", handleWheel, { passive: false })

    // Animation loop
    let animationId: number
    let frame = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      frame++

      // Slow auto-rotation when not dragging
      if (earth && !isDragging) {
        earth.rotation.y += 0.0001
      }

      // Update plane position
      if (aircraftGroup && points3D.length > 0) {
        const currentIndex = Math.min(
          Math.floor(planeProgress * (points3D.length - 1)),
          points3D.length - 1
        )
        const planePoint = points3D[currentIndex]

        if (planePoint) {
          aircraftGroup.position.copy(planePoint)

          // Orient aircraft to face direction
          if (currentIndex < points3D.length - 1) {
            const nextIndex = Math.min(currentIndex + 5, points3D.length - 1)
            const nextPoint = points3D[nextIndex]
            const direction = new THREE.Vector3().subVectors(nextPoint, planePoint).normalize()

            // Create quaternion for orientation
            const up = planePoint.clone().normalize()
            const quaternion = new THREE.Quaternion()
            const matrix = new THREE.Matrix4()
            matrix.lookAt(new THREE.Vector3(), direction, up)
            quaternion.setFromRotationMatrix(matrix)
            aircraftGroup.quaternion.slerp(quaternion, 0.1)
          }

          // Update trail with traveled path
          if (!isPaused && trailLineRef.current) {
            const traveledPoints = points3D.slice(0, currentIndex + 1)
            if (traveledPoints.length > 1) {
              const trailGeom = new THREE.BufferGeometry().setFromPoints(traveledPoints)
              trailLineRef.current.geometry.dispose()
              trailLineRef.current.geometry = trailGeom
            }
          }
        }
      }

      // Pulse airport rings
      scene.children.forEach((child) => {
        if (child.userData.pulsePhase !== undefined) {
          const pulse = Math.sin(frame * 0.03 + child.userData.pulsePhase) * 0.3 + 1
          child.scale.set(pulse, pulse, pulse)
        }
      })

      // Pulse aircraft glow
      if (aircraftGlow) {
        aircraftGlow.scale.setScalar(1 + Math.sin(frame * 0.1) * 0.2)
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
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("mouseleave", handleMouseUp)
      container.removeEventListener("wheel", handleWheel)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isInitialized, route])

  // Update plane position when progress changes
  useEffect(() => {
    if (!planeRef.current || routePointsRef.current.length === 0) return

    const points3D = routePointsRef.current
    const currentIndex = Math.min(
      Math.floor(planeProgress * (points3D.length - 1)),
      points3D.length - 1
    )
    const planePoint = points3D[currentIndex]

    if (planePoint) {
      planeRef.current.position.copy(planePoint)

      // Update trail
      if (trailLineRef.current && currentIndex > 0) {
        const traveledPoints = points3D.slice(0, currentIndex + 1)
        const trailGeom = new THREE.BufferGeometry().setFromPoints(traveledPoints)
        trailLineRef.current.geometry.dispose()
        trailLineRef.current.geometry = trailGeom
      }
    }
  }, [planeProgress])

  return <div ref={containerRef} className="w-full h-full" />
}
