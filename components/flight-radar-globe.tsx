"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import type { Route } from "@/lib/routes-data"
import { generateGreatCirclePoints } from "@/lib/routes-data"

interface FlightRadarGlobeProps {
  route: Route
  planeProgress: number
  isPaused?: boolean
  currentAltitude?: number
}

type FlightPhase = "takeoff" | "climb" | "cruise" | "descent" | "landing"

function getFlightPhase(progress: number): FlightPhase {
  if (progress < 0.03) return "takeoff"
  if (progress < 0.12) return "climb"
  if (progress < 0.88) return "cruise"
  if (progress < 0.97) return "descent"
  return "landing"
}

export function FlightRadarGlobe({ route, planeProgress, isPaused }: FlightRadarGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const planeGroupRef = useRef<THREE.Group | null>(null)
  const planeModelRef = useRef<THREE.Object3D | null>(null)
  const trailLineRef = useRef<THREE.Line | null>(null)
  const routePointsRef = useRef<THREE.Vector3[]>([])
  const animationFrameRef = useRef<number>(0)
  const earthRef = useRef<THREE.Mesh | null>(null)
  const [flightPhase, setFlightPhase] = useState<FlightPhase>("takeoff")
  const [isClient, setIsClient] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getPlaneElevation = useCallback((progress: number): number => {
    const phase = getFlightPhase(progress)
    switch (phase) {
      case "takeoff":
        return 1.01 + (progress / 0.03) * 0.04
      case "climb":
        return 1.05 + ((progress - 0.03) / 0.09) * 0.08
      case "cruise":
        return 1.13 + Math.sin(((progress - 0.12) / 0.76) * Math.PI * 3) * 0.02
      case "descent":
        return 1.13 - ((progress - 0.88) / 0.09) * 0.08
      case "landing":
        return 1.05 - ((progress - 0.97) / 0.03) * 0.04
      default:
        return 1.1
    }
  }, [])

  // Get bank angle for realistic turns
  const getBankAngle = useCallback((progress: number, prevProgress: number): number => {
    // Calculate rate of direction change for banking
    const phase = getFlightPhase(progress)
    if (phase === "takeoff" || phase === "landing") return 0

    // Slight banking during flight
    const oscillation = Math.sin(progress * Math.PI * 8) * 0.1
    return oscillation
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (rendererRef.current) {
      rendererRef.current.dispose()
      if (container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement)
      }
    }

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000814)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    cameraRef.current = camera

    const midLat = (route.origin.lat + route.destination.lat) / 2
    const midLng = (route.origin.lng + route.destination.lng) / 2
    const latRad = (midLat * Math.PI) / 180
    const lngRad = (midLng * Math.PI) / 180

    const routeDistance = Math.abs(route.origin.lat - route.destination.lat) +
      Math.abs(route.origin.lng - route.destination.lng)
    const camDist = Math.max(2.5, Math.min(4.5, routeDistance / 30 + 2.5))

    camera.position.set(
      camDist * Math.cos(latRad) * Math.cos(lngRad),
      camDist * Math.sin(latRad) + 0.5,
      camDist * Math.cos(latRad) * Math.sin(lngRad)
    )
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ============ EARTH ============
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128)

    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg'
    )
    const bumpMap = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
    )

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 0.7,
      metalness: 0.0,
    })

    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earthRef.current = earth
    earth.rotation.y = -lngRad - Math.PI / 2
    scene.add(earth)

    // Atmosphere
    const atmosphereGeo = new THREE.SphereGeometry(1.02, 64, 64)
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 0.4) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
    scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat))

    // ============ LIGHTS ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
    sunLight.position.set(5, 3, 5)
    sunLight.castShadow = true
    scene.add(sunLight)

    const moonLight = new THREE.DirectionalLight(0x4477ff, 0.3)
    moonLight.position.set(-5, -2, -5)
    scene.add(moonLight)

    // Hemisphere light for better model visibility
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    scene.add(hemiLight)

    // ============ FLIGHT PATH ============
    const routePoints = generateGreatCirclePoints(
      route.origin.lat, route.origin.lng,
      route.destination.lat, route.destination.lng,
      200
    )

    routePointsRef.current = routePoints.map(([lat, lng]) => {
      const latRad = (lat * Math.PI) / 180
      const lngRad = (lng * Math.PI) / 180
      const x = Math.cos(latRad) * Math.cos(lngRad)
      const y = Math.sin(latRad)
      const z = Math.cos(latRad) * Math.sin(lngRad)
      return new THREE.Vector3(x, y, z)
    })

    const pathPoints = routePointsRef.current.map((p, i) => {
      const t = i / (routePointsRef.current.length - 1)
      const arc = Math.sin(t * Math.PI) * 0.1
      return p.clone().multiplyScalar(1.02 + arc)
    })

    const routeCurve = new THREE.CatmullRomCurve3(pathPoints)
    const routeGeometry = new THREE.TubeGeometry(routeCurve, 200, 0.003, 8, false)
    const routeMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.7,
    })
    scene.add(new THREE.Mesh(routeGeometry, routeMaterial))

    // ============ LOAD CUSTOM JET MODEL ============
    const planeGroup = new THREE.Group()
    planeGroupRef.current = planeGroup
    scene.add(planeGroup)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      '/jet.glb',
      (gltf) => {
        const model = gltf.scene
        planeModelRef.current = model

        // Adjust scale - you may need to tweak this based on your model size
        model.scale.set(0.008, 0.008, 0.008)

        // Center the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)

        // Make materials emissive for visibility
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial
              if (mat.emissive) {
                mat.emissive = new THREE.Color(0x111111)
                mat.emissiveIntensity = 0.2
              }
            }
          }
        })

        planeGroup.add(model)
        setModelLoaded(true)
        console.log('✈️ Jet model loaded successfully!')
      },
      (progress) => {
        console.log('Loading jet model:', Math.round((progress.loaded / progress.total) * 100) + '%')
      },
      (error) => {
        console.error('Error loading jet model:', error)
        // Fallback to simple plane geometry
        createFallbackPlane(planeGroup)
        setModelLoaded(true)
      }
    )

    // Plane glow effect
    const glowGeo = new THREE.SphereGeometry(0.04, 16, 16)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.2 })
    const planeGlow = new THREE.Mesh(glowGeo, glowMat)
    planeGlow.userData.isPlaneGlow = true
    planeGroup.add(planeGlow)

    // Engine trail particles
    const trailGeo = new THREE.BufferGeometry()
    const trailMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 })
    const trailLine = new THREE.Line(trailGeo, trailMat)
    trailLineRef.current = trailLine
    scene.add(trailLine)

    // ============ AIRPORT MARKERS ============
    const createAirportMarker = (lat: number, lng: number, isOrigin: boolean) => {
      const latRad = (lat * Math.PI) / 180
      const lngRad = (lng * Math.PI) / 180
      const x = Math.cos(latRad) * Math.cos(lngRad)
      const y = Math.sin(latRad)
      const z = Math.cos(latRad) * Math.sin(lngRad)
      const pos = new THREE.Vector3(x, y, z)

      const color = isOrigin ? 0x22c55e : 0xf59e0b

      const dotGeo = new THREE.SphereGeometry(0.02, 16, 16)
      const dotMat = new THREE.MeshBasicMaterial({ color })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos.clone().multiplyScalar(1.01))
      scene.add(dot)

      const ringGeo = new THREE.TorusGeometry(0.035, 0.004, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos.clone().multiplyScalar(1.015))
      ring.lookAt(0, 0, 0)
      ring.userData.isPulseRing = true
      ring.userData.phase = isOrigin ? 0 : Math.PI
      scene.add(ring)

      const beamGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.15, 8)
      const beamMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.position.copy(pos.clone().multiplyScalar(1.08))
      beam.lookAt(0, 0, 0)
      beam.rotateX(Math.PI / 2)
      scene.add(beam)
    }

    createAirportMarker(route.origin.lat, route.origin.lng, true)
    createAirportMarker(route.destination.lat, route.destination.lng, false)

    // ============ MOUSE CONTROLS ============
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !earthRef.current) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      earthRef.current.rotation.y += dx * 0.005
      earthRef.current.rotation.x = Math.max(-1, Math.min(1, earthRef.current.rotation.x + dy * 0.005))
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => { isDragging = false }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const scale = e.deltaY > 0 ? 1.05 : 0.95
      camera.position.multiplyScalar(scale)
      camera.position.clampLength(1.8, 6)
    }

    container.addEventListener("mousedown", onMouseDown)
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseup", onMouseUp)
    container.addEventListener("mouseleave", onMouseUp)
    container.addEventListener("wheel", onWheel, { passive: false })

    // ============ ANIMATION ============
    let frame = 0
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      frame++

      scene.traverse((obj) => {
        if (obj.userData.isPulseRing && obj instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(frame * 0.04 + (obj.userData.phase || 0)) * 0.25
          obj.scale.set(scale, scale, 1)
          const mat = obj.material as THREE.MeshBasicMaterial
          if (mat.opacity !== undefined) mat.opacity = 0.7 - scale * 0.2
        }
        if (obj.userData.isPlaneGlow && obj instanceof THREE.Mesh) {
          const mat = obj.material as THREE.MeshBasicMaterial
          if (mat.opacity !== undefined) mat.opacity = 0.15 + Math.sin(frame * 0.05) * 0.08
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousedown", onMouseDown)
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseup", onMouseUp)
      container.removeEventListener("mouseleave", onMouseUp)
      container.removeEventListener("wheel", onWheel)
      cancelAnimationFrame(animationFrameRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [route, isClient])

  // Update plane position and REALISTIC rotation
  useEffect(() => {
    if (!planeGroupRef.current || routePointsRef.current.length === 0) return

    const points = routePointsRef.current
    const totalPoints = points.length - 1
    const currentIndex = Math.min(Math.floor(planeProgress * totalPoints), totalPoints)

    const basePos = points[currentIndex].clone()
    const elevation = getPlaneElevation(planeProgress)
    const planePos = basePos.multiplyScalar(elevation)

    planeGroupRef.current.position.copy(planePos)
    setFlightPhase(getFlightPhase(planeProgress))

    // Calculate direction and apply realistic rotation
    if (currentIndex < totalPoints - 1) {
      const lookAhead = Math.min(currentIndex + 8, totalPoints)
      const nextPos = points[lookAhead].clone().multiplyScalar(getPlaneElevation(lookAhead / totalPoints))
      const direction = new THREE.Vector3().subVectors(nextPos, planePos).normalize()

      // Calculate up vector (radial from earth center)
      const up = planePos.clone().normalize()

      // Calculate right vector
      const right = new THREE.Vector3().crossVectors(up, direction).normalize()
      const correctedUp = new THREE.Vector3().crossVectors(direction, right).normalize()

      // Create rotation matrix
      const matrix = new THREE.Matrix4()
      matrix.makeBasis(right, correctedUp, direction)

      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix)

      // Smooth rotation interpolation
      planeGroupRef.current.quaternion.slerp(targetQuat, 0.08)

      // Apply pitch based on flight phase (nose up/down)
      const phase = getFlightPhase(planeProgress)
      let pitch = 0
      if (phase === "takeoff") pitch = 0.35  // Nose up during takeoff
      else if (phase === "climb") pitch = 0.2   // Less nose up during climb
      else if (phase === "cruise") pitch = 0   // Level flight
      else if (phase === "descent") pitch = -0.12 // Nose down during descent
      else if (phase === "landing") pitch = -0.25 // More nose down for landing

      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(right, pitch)
      planeGroupRef.current.quaternion.multiply(pitchQuat)

      // Apply banking during turns (roll)
      const bankAngle = getBankAngle(planeProgress, 0)
      const bankQuat = new THREE.Quaternion().setFromAxisAngle(direction, bankAngle)
      planeGroupRef.current.quaternion.multiply(bankQuat)
    }

    // Update trail
    if (trailLineRef.current && currentIndex > 0) {
      const trailStart = Math.max(0, currentIndex - 100)
      const trailPoints = points.slice(trailStart, currentIndex + 1).map((p, i) => {
        const idx = trailStart + i
        return p.clone().multiplyScalar(getPlaneElevation(idx / totalPoints))
      })
      const trailGeom = new THREE.BufferGeometry().setFromPoints(trailPoints)
      trailLineRef.current.geometry.dispose()
      trailLineRef.current.geometry = trailGeom
    }
  }, [planeProgress, getPlaneElevation, getBankAngle])

  if (!isClient) {
    return <div className="w-full h-full bg-slate-950" />
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* Flight phase indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-4 py-2 rounded-full backdrop-blur-md border text-sm font-bold ${flightPhase === "takeoff" ? "bg-amber-500/20 border-amber-500/40 text-amber-400" :
            flightPhase === "climb" ? "bg-blue-500/20 border-blue-500/40 text-blue-400" :
              flightPhase === "cruise" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" :
                flightPhase === "descent" ? "bg-orange-500/20 border-orange-500/40 text-orange-400" :
                  "bg-red-500/20 border-red-500/40 text-red-400"
          }`}>
          {flightPhase === "takeoff" && "🛫 TAKING OFF"}
          {flightPhase === "climb" && "📈 CLIMBING"}
          {flightPhase === "cruise" && "✈️ CRUISING"}
          {flightPhase === "descent" && "📉 DESCENDING"}
          {flightPhase === "landing" && "🛬 LANDING"}
        </div>
      </div>

      {/* Model loading indicator */}
      {!modelLoaded && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-slate-900/80 rounded-full text-xs text-gray-400">
          Loading jet model...
        </div>
      )}
    </div>
  )
}

// Fallback plane if GLB fails to load
function createFallbackPlane(group: THREE.Group) {
  const bodyGeo = new THREE.ConeGeometry(0.015, 0.06, 8)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.rotation.x = Math.PI / 2
  group.add(body)

  const wingGeo = new THREE.BoxGeometry(0.08, 0.004, 0.02)
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const wings = new THREE.Mesh(wingGeo, wingMat)
  wings.position.z = -0.01
  group.add(wings)
}
