export interface Airport {
  name: string
  code: string
  city: string
  country: string
  lat: number
  lng: number
}

export interface Route {
  origin: Airport
  destination: Airport
  distance: number // in kilometers
  flightDuration: number // in minutes
}

// Comprehensive global airport database
export const AIRPORTS: Airport[] = [
  // India
  { name: "Chhatrapati Shivaji Maharaj International", code: "BOM", city: "Mumbai", country: "India", lat: 19.089, lng: 72.868 },
  { name: "Indira Gandhi International", code: "DEL", city: "Delhi", country: "India", lat: 28.566, lng: 77.103 },
  { name: "Kempegowda International", code: "BLR", city: "Bangalore", country: "India", lat: 13.199, lng: 77.706 },
  { name: "Rajiv Gandhi International", code: "HYD", city: "Hyderabad", country: "India", lat: 17.231, lng: 78.430 },
  { name: "Chennai International", code: "MAA", city: "Chennai", country: "India", lat: 12.990, lng: 80.169 },
  { name: "Netaji Subhas Chandra Bose International", code: "CCU", city: "Kolkata", country: "India", lat: 22.654, lng: 88.447 },

  // Middle East
  { name: "Dubai International", code: "DXB", city: "Dubai", country: "UAE", lat: 25.252, lng: 55.364 },
  { name: "Abu Dhabi International", code: "AUH", city: "Abu Dhabi", country: "UAE", lat: 24.433, lng: 54.651 },
  { name: "Hamad International", code: "DOH", city: "Doha", country: "Qatar", lat: 25.273, lng: 51.608 },
  { name: "King Abdulaziz International", code: "JED", city: "Jeddah", country: "Saudi Arabia", lat: 21.679, lng: 39.157 },
  { name: "King Khalid International", code: "RUH", city: "Riyadh", country: "Saudi Arabia", lat: 24.958, lng: 46.699 },
  { name: "Bahrain International", code: "BAH", city: "Manama", country: "Bahrain", lat: 26.271, lng: 50.634 },
  { name: "Muscat International", code: "MCT", city: "Muscat", country: "Oman", lat: 23.593, lng: 58.284 },
  { name: "Kuwait International", code: "KWI", city: "Kuwait City", country: "Kuwait", lat: 29.227, lng: 47.969 },

  // Southeast Asia
  { name: "Singapore Changi", code: "SIN", city: "Singapore", country: "Singapore", lat: 1.359, lng: 103.989 },
  { name: "Kuala Lumpur International", code: "KUL", city: "Kuala Lumpur", country: "Malaysia", lat: 2.744, lng: 101.698 },
  { name: "Suvarnabhumi Airport", code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.681, lng: 100.747 },
  { name: "Ngurah Rai International", code: "DPS", city: "Bali", country: "Indonesia", lat: -8.748, lng: 115.167 },
  { name: "Soekarno-Hatta International", code: "CGK", city: "Jakarta", country: "Indonesia", lat: -6.126, lng: 106.656 },
  { name: "Tan Son Nhat International", code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.818, lng: 106.659 },
  { name: "Ninoy Aquino International", code: "MNL", city: "Manila", country: "Philippines", lat: 14.509, lng: 121.020 },

  // East Asia
  { name: "Hong Kong International", code: "HKG", city: "Hong Kong", country: "China", lat: 22.309, lng: 113.915 },
  { name: "Tokyo Narita International", code: "NRT", city: "Tokyo", country: "Japan", lat: 35.765, lng: 140.386 },
  { name: "Tokyo Haneda", code: "HND", city: "Tokyo", country: "Japan", lat: 35.553, lng: 139.781 },
  { name: "Incheon International", code: "ICN", city: "Seoul", country: "South Korea", lat: 37.469, lng: 126.451 },
  { name: "Beijing Capital International", code: "PEK", city: "Beijing", country: "China", lat: 40.080, lng: 116.603 },
  { name: "Shanghai Pudong International", code: "PVG", city: "Shanghai", country: "China", lat: 31.143, lng: 121.805 },
  { name: "Taipei Taoyuan International", code: "TPE", city: "Taipei", country: "Taiwan", lat: 25.080, lng: 121.234 },

  // Europe
  { name: "London Heathrow", code: "LHR", city: "London", country: "UK", lat: 51.470, lng: -0.461 },
  { name: "London Gatwick", code: "LGW", city: "London", country: "UK", lat: 51.148, lng: -0.190 },
  { name: "Paris Charles de Gaulle", code: "CDG", city: "Paris", country: "France", lat: 49.009, lng: 2.550 },
  { name: "Frankfurt Main", code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.033, lng: 8.571 },
  { name: "Amsterdam Schiphol", code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.308, lng: 4.764 },
  { name: "Madrid-Barajas", code: "MAD", city: "Madrid", country: "Spain", lat: 40.472, lng: -3.561 },
  { name: "Barcelona-El Prat", code: "BCN", city: "Barcelona", country: "Spain", lat: 41.297, lng: 2.078 },
  { name: "Munich Airport", code: "MUC", city: "Munich", country: "Germany", lat: 48.353, lng: 11.786 },
  { name: "Rome Fiumicino", code: "FCO", city: "Rome", country: "Italy", lat: 41.804, lng: 12.251 },
  { name: "Zurich Airport", code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.458, lng: 8.548 },
  { name: "Vienna International", code: "VIE", city: "Vienna", country: "Austria", lat: 48.110, lng: 16.570 },
  { name: "Istanbul Airport", code: "IST", city: "Istanbul", country: "Turkey", lat: 41.262, lng: 28.742 },
  { name: "Moscow Sheremetyevo", code: "SVO", city: "Moscow", country: "Russia", lat: 55.973, lng: 37.412 },
  { name: "Dublin Airport", code: "DUB", city: "Dublin", country: "Ireland", lat: 53.421, lng: -6.270 },

  // North America
  { name: "John F. Kennedy International", code: "JFK", city: "New York", country: "USA", lat: 40.641, lng: -73.778 },
  { name: "Los Angeles International", code: "LAX", city: "Los Angeles", country: "USA", lat: 33.943, lng: -118.408 },
  { name: "San Francisco International", code: "SFO", city: "San Francisco", country: "USA", lat: 37.619, lng: -122.375 },
  { name: "Chicago O'Hare International", code: "ORD", city: "Chicago", country: "USA", lat: 41.979, lng: -87.905 },
  { name: "Miami International", code: "MIA", city: "Miami", country: "USA", lat: 25.795, lng: -80.287 },
  { name: "Dallas/Fort Worth International", code: "DFW", city: "Dallas", country: "USA", lat: 32.897, lng: -97.038 },
  { name: "Denver International", code: "DEN", city: "Denver", country: "USA", lat: 39.856, lng: -104.674 },
  { name: "Seattle-Tacoma International", code: "SEA", city: "Seattle", country: "USA", lat: 47.449, lng: -122.309 },
  { name: "Toronto Pearson International", code: "YYZ", city: "Toronto", country: "Canada", lat: 43.677, lng: -79.630 },
  { name: "Vancouver International", code: "YVR", city: "Vancouver", country: "Canada", lat: 49.195, lng: -123.179 },
  { name: "Mexico City International", code: "MEX", city: "Mexico City", country: "Mexico", lat: 19.436, lng: -99.072 },

  // South America
  { name: "São Paulo-Guarulhos International", code: "GRU", city: "São Paulo", country: "Brazil", lat: -23.432, lng: -46.470 },
  { name: "Buenos Aires Ezeiza", code: "EZE", city: "Buenos Aires", country: "Argentina", lat: -34.822, lng: -58.536 },
  { name: "El Dorado International", code: "BOG", city: "Bogotá", country: "Colombia", lat: 4.702, lng: -74.147 },
  { name: "Jorge Chávez International", code: "LIM", city: "Lima", country: "Peru", lat: -12.022, lng: -77.114 },
  { name: "Arturo Merino Benítez International", code: "SCL", city: "Santiago", country: "Chile", lat: -33.393, lng: -70.786 },

  // Australia & Oceania
  { name: "Sydney Kingsford Smith", code: "SYD", city: "Sydney", country: "Australia", lat: -33.946, lng: 151.177 },
  { name: "Melbourne Airport", code: "MEL", city: "Melbourne", country: "Australia", lat: -37.673, lng: 144.844 },
  { name: "Brisbane Airport", code: "BNE", city: "Brisbane", country: "Australia", lat: -27.384, lng: 153.117 },
  { name: "Perth Airport", code: "PER", city: "Perth", country: "Australia", lat: -31.940, lng: 115.967 },
  { name: "Auckland Airport", code: "AKL", city: "Auckland", country: "New Zealand", lat: -37.008, lng: 174.792 },

  // Africa
  { name: "O. R. Tambo International", code: "JNB", city: "Johannesburg", country: "South Africa", lat: -26.134, lng: 28.242 },
  { name: "Cape Town International", code: "CPT", city: "Cape Town", country: "South Africa", lat: -33.965, lng: 18.602 },
  { name: "Cairo International", code: "CAI", city: "Cairo", country: "Egypt", lat: 30.112, lng: 31.400 },
  { name: "Jomo Kenyatta International", code: "NBO", city: "Nairobi", country: "Kenya", lat: -1.319, lng: 36.928 },
  { name: "Mohammed V International", code: "CMN", city: "Casablanca", country: "Morocco", lat: 33.367, lng: -7.590 },
]

// Calculate great circle distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate realistic flight duration based on distance
// Uses average commercial jet speed of 870 km/h plus buffer for takeoff/landing
export function calculateFlightDuration(distance: number): number {
  const cruisingSpeedKmh = 870 // Average commercial jet speed
  const taxiAndProceduresMinutes = 30 // Takeoff, landing, taxi time
  
  const flightTimeHours = distance / cruisingSpeedKmh
  const flightTimeMinutes = Math.round(flightTimeHours * 60) + taxiAndProceduresMinutes
  
  return flightTimeMinutes
}

// Get a route between two airports by their codes
export function getRoute(originCode: string, destCode: string): Route | null {
  const origin = AIRPORTS.find(a => a.code === originCode)
  const destination = AIRPORTS.find(a => a.code === destCode)
  
  if (!origin || !destination || origin.code === destination.code) {
    return null
  }
  
  const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
  const flightDuration = calculateFlightDuration(distance)
  
  return { origin, destination, distance, flightDuration }
}

// Get airport by code
export function getAirport(code: string): Airport | undefined {
  return AIRPORTS.find(a => a.code === code)
}

// Search airports by query (code, city, or country)
export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase().trim()
  if (!q) return AIRPORTS
  
  return AIRPORTS.filter(airport => 
    airport.code.toLowerCase().includes(q) ||
    airport.city.toLowerCase().includes(q) ||
    airport.country.toLowerCase().includes(q) ||
    airport.name.toLowerCase().includes(q)
  )
}

// Get popular routes for quick selection
export function getPopularRoutes(): { origin: string; destination: string; label: string }[] {
  return [
    { origin: "BOM", destination: "DXB", label: "Mumbai → Dubai" },
    { origin: "DEL", destination: "LHR", label: "Delhi → London" },
    { origin: "JFK", destination: "LHR", label: "New York → London" },
    { origin: "SIN", destination: "SYD", label: "Singapore → Sydney" },
    { origin: "LAX", destination: "NRT", label: "Los Angeles → Tokyo" },
    { origin: "DXB", destination: "JFK", label: "Dubai → New York" },
    { origin: "HKG", destination: "SFO", label: "Hong Kong → San Francisco" },
    { origin: "CDG", destination: "BKK", label: "Paris → Bangkok" },
  ]
}

// Format duration as hours and minutes
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Format distance with commas
export function formatDistance(km: number): string {
  return Math.round(km).toLocaleString() + " km"
}

// Generate great circle points for route visualization
export function generateGreatCirclePoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numPoints = 100,
): Array<[number, number]> {
  const points: Array<[number, number]> = []

  const startLat_rad = (startLat * Math.PI) / 180
  const startLng_rad = (startLng * Math.PI) / 180
  const endLat_rad = (endLat * Math.PI) / 180
  const endLng_rad = (endLng * Math.PI) / 180

  const centralAngle = Math.acos(
    Math.sin(startLat_rad) * Math.sin(endLat_rad) +
      Math.cos(startLat_rad) * Math.cos(endLat_rad) * Math.cos(Math.abs(endLng_rad - startLng_rad)),
  )

  // Handle very short distances to avoid division by zero
  if (centralAngle < 0.0001) {
    return [[startLat, startLng], [endLat, endLng]]
  }

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints
    const a = Math.sin((1 - fraction) * centralAngle) / Math.sin(centralAngle)
    const b = Math.sin(fraction * centralAngle) / Math.sin(centralAngle)

    const x = a * Math.cos(startLat_rad) * Math.cos(startLng_rad) + b * Math.cos(endLat_rad) * Math.cos(endLng_rad)
    const y = a * Math.cos(startLat_rad) * Math.sin(startLng_rad) + b * Math.cos(endLat_rad) * Math.sin(endLng_rad)
    const z = a * Math.sin(startLat_rad) + b * Math.sin(endLat_rad)

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * (180 / Math.PI)
    const lng = Math.atan2(y, x) * (180 / Math.PI)

    points.push([lat, lng])
  }

  return points
}

// Legacy function for backward compatibility
export function generateRandomRoute(): Route {
  const originIndex = Math.floor(Math.random() * AIRPORTS.length)
  let destIndex = Math.floor(Math.random() * AIRPORTS.length)
  while (destIndex === originIndex) {
    destIndex = Math.floor(Math.random() * AIRPORTS.length)
  }

  const origin = AIRPORTS[originIndex]
  const destination = AIRPORTS[destIndex]
  const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
  const flightDuration = calculateFlightDuration(distance)

  return { origin, destination, distance, flightDuration }
}
