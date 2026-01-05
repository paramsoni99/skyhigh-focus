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

// Comprehensive global airport database - 150+ airports
export const AIRPORTS: Airport[] = [
  // ==================== INDIA (30 airports) ====================
  { name: "Chhatrapati Shivaji Maharaj International", code: "BOM", city: "Mumbai", country: "India", lat: 19.0896, lng: 72.8656 },
  { name: "Indira Gandhi International", code: "DEL", city: "New Delhi", country: "India", lat: 28.5562, lng: 77.1000 },
  { name: "Kempegowda International", code: "BLR", city: "Bangalore", country: "India", lat: 13.1986, lng: 77.7066 },
  { name: "Rajiv Gandhi International", code: "HYD", city: "Hyderabad", country: "India", lat: 17.2403, lng: 78.4294 },
  { name: "Chennai International", code: "MAA", city: "Chennai", country: "India", lat: 12.9941, lng: 80.1709 },
  { name: "Netaji Subhas Chandra Bose International", code: "CCU", city: "Kolkata", country: "India", lat: 22.6520, lng: 88.4463 },
  { name: "Cochin International", code: "COK", city: "Kochi", country: "India", lat: 10.1520, lng: 76.4019 },
  { name: "Goa International", code: "GOI", city: "Goa", country: "India", lat: 15.3808, lng: 73.8314 },
  { name: "Pune International", code: "PNQ", city: "Pune", country: "India", lat: 18.5822, lng: 73.9197 },
  { name: "Jaipur International", code: "JAI", city: "Jaipur", country: "India", lat: 26.8242, lng: 75.8122 },
  { name: "Sardar Vallabhbhai Patel International", code: "AMD", city: "Ahmedabad", country: "India", lat: 23.0772, lng: 72.6347 },
  { name: "Trivandrum International", code: "TRV", city: "Thiruvananthapuram", country: "India", lat: 8.4821, lng: 76.9201 },
  { name: "Calicut International", code: "CCJ", city: "Kozhikode", country: "India", lat: 11.1368, lng: 75.9553 },
  { name: "Mangalore International", code: "IXE", city: "Mangalore", country: "India", lat: 12.9612, lng: 74.8900 },
  { name: "Lucknow Airport", code: "LKO", city: "Lucknow", country: "India", lat: 26.7606, lng: 80.8893 },
  { name: "Varanasi Airport", code: "VNS", city: "Varanasi", country: "India", lat: 25.4524, lng: 82.8592 },
  { name: "Patna Airport", code: "PAT", city: "Patna", country: "India", lat: 25.5913, lng: 85.0880 },
  { name: "Bhubaneswar Airport", code: "BBI", city: "Bhubaneswar", country: "India", lat: 20.2444, lng: 85.8178 },
  { name: "Guwahati Airport", code: "GAU", city: "Guwahati", country: "India", lat: 26.1061, lng: 91.5859 },
  { name: "Srinagar International", code: "SXR", city: "Srinagar", country: "India", lat: 33.9871, lng: 74.7742 },
  { name: "Amritsar Airport", code: "ATQ", city: "Amritsar", country: "India", lat: 31.7096, lng: 74.7973 },
  { name: "Chandigarh Airport", code: "IXC", city: "Chandigarh", country: "India", lat: 30.6735, lng: 76.7885 },
  { name: "Indore Airport", code: "IDR", city: "Indore", country: "India", lat: 22.7217, lng: 75.8011 },
  { name: "Nagpur Airport", code: "NAG", city: "Nagpur", country: "India", lat: 21.0922, lng: 79.0472 },
  { name: "Coimbatore International", code: "CJB", city: "Coimbatore", country: "India", lat: 11.0300, lng: 77.0434 },
  { name: "Visakhapatnam Airport", code: "VTZ", city: "Visakhapatnam", country: "India", lat: 17.7212, lng: 83.2245 },
  { name: "Udaipur Airport", code: "UDR", city: "Udaipur", country: "India", lat: 24.6177, lng: 73.8961 },
  { name: "Bagdogra Airport", code: "IXB", city: "Siliguri", country: "India", lat: 26.6812, lng: 88.3286 },
  { name: "Ranchi Airport", code: "IXR", city: "Ranchi", country: "India", lat: 23.3143, lng: 85.3217 },
  { name: "Raipur Airport", code: "RPR", city: "Raipur", country: "India", lat: 21.1804, lng: 81.7388 },

  // ==================== MIDDLE EAST ====================
  { name: "Dubai International", code: "DXB", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657 },
  { name: "Abu Dhabi International", code: "AUH", city: "Abu Dhabi", country: "UAE", lat: 24.4330, lng: 54.6511 },
  { name: "Hamad International", code: "DOH", city: "Doha", country: "Qatar", lat: 25.2731, lng: 51.6081 },
  { name: "King Abdulaziz International", code: "JED", city: "Jeddah", country: "Saudi Arabia", lat: 21.6796, lng: 39.1565 },
  { name: "King Khalid International", code: "RUH", city: "Riyadh", country: "Saudi Arabia", lat: 24.9576, lng: 46.6988 },
  { name: "Bahrain International", code: "BAH", city: "Manama", country: "Bahrain", lat: 26.2708, lng: 50.6336 },
  { name: "Muscat International", code: "MCT", city: "Muscat", country: "Oman", lat: 23.5933, lng: 58.2844 },
  { name: "Kuwait International", code: "KWI", city: "Kuwait City", country: "Kuwait", lat: 29.2266, lng: 47.9689 },
  { name: "Ben Gurion Airport", code: "TLV", city: "Tel Aviv", country: "Israel", lat: 32.0114, lng: 34.8867 },
  { name: "Beirut–Rafic Hariri International", code: "BEY", city: "Beirut", country: "Lebanon", lat: 33.8208, lng: 35.4884 },

  // ==================== SOUTHEAST ASIA ====================
  { name: "Singapore Changi", code: "SIN", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
  { name: "Kuala Lumpur International", code: "KUL", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lng: 101.7099 },
  { name: "Suvarnabhumi Airport", code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.6900, lng: 100.7501 },
  { name: "Ngurah Rai International", code: "DPS", city: "Bali", country: "Indonesia", lat: -8.7482, lng: 115.1672 },
  { name: "Soekarno-Hatta International", code: "CGK", city: "Jakarta", country: "Indonesia", lat: -6.1256, lng: 106.6558 },
  { name: "Tan Son Nhat International", code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8188, lng: 106.6519 },
  { name: "Noi Bai International", code: "HAN", city: "Hanoi", country: "Vietnam", lat: 21.2212, lng: 105.8070 },
  { name: "Ninoy Aquino International", code: "MNL", city: "Manila", country: "Philippines", lat: 14.5086, lng: 121.0197 },
  { name: "Phuket International", code: "HKT", city: "Phuket", country: "Thailand", lat: 8.1132, lng: 98.3169 },
  { name: "Yangon International", code: "RGN", city: "Yangon", country: "Myanmar", lat: 16.9073, lng: 96.1332 },

  // ==================== EAST ASIA ====================
  { name: "Hong Kong International", code: "HKG", city: "Hong Kong", country: "China", lat: 22.3080, lng: 113.9185 },
  { name: "Tokyo Narita International", code: "NRT", city: "Tokyo", country: "Japan", lat: 35.7653, lng: 140.3864 },
  { name: "Tokyo Haneda", code: "HND", city: "Tokyo", country: "Japan", lat: 35.5533, lng: 139.7811 },
  { name: "Osaka Kansai International", code: "KIX", city: "Osaka", country: "Japan", lat: 34.4347, lng: 135.2441 },
  { name: "Incheon International", code: "ICN", city: "Seoul", country: "South Korea", lat: 37.4602, lng: 126.4407 },
  { name: "Beijing Capital International", code: "PEK", city: "Beijing", country: "China", lat: 40.0799, lng: 116.6031 },
  { name: "Shanghai Pudong International", code: "PVG", city: "Shanghai", country: "China", lat: 31.1434, lng: 121.8052 },
  { name: "Guangzhou Baiyun International", code: "CAN", city: "Guangzhou", country: "China", lat: 23.3924, lng: 113.2988 },
  { name: "Taipei Taoyuan International", code: "TPE", city: "Taipei", country: "Taiwan", lat: 25.0797, lng: 121.2342 },
  { name: "Macau International", code: "MFM", city: "Macau", country: "Macau", lat: 22.1496, lng: 113.5915 },
  { name: "Shenzhen Bao'an International", code: "SZX", city: "Shenzhen", country: "China", lat: 22.6393, lng: 113.8107 },

  // ==================== EUROPE ====================
  { name: "London Heathrow", code: "LHR", city: "London", country: "UK", lat: 51.4700, lng: -0.4543 },
  { name: "London Gatwick", code: "LGW", city: "London", country: "UK", lat: 51.1537, lng: -0.1821 },
  { name: "London Stansted", code: "STN", city: "London", country: "UK", lat: 51.8850, lng: 0.2350 },
  { name: "Manchester Airport", code: "MAN", city: "Manchester", country: "UK", lat: 53.3537, lng: -2.2750 },
  { name: "Edinburgh Airport", code: "EDI", city: "Edinburgh", country: "UK", lat: 55.9500, lng: -3.3725 },
  { name: "Paris Charles de Gaulle", code: "CDG", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479 },
  { name: "Paris Orly", code: "ORY", city: "Paris", country: "France", lat: 48.7233, lng: 2.3794 },
  { name: "Nice Côte d'Azur", code: "NCE", city: "Nice", country: "France", lat: 43.6584, lng: 7.2159 },
  { name: "Frankfurt Main", code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.0379, lng: 8.5622 },
  { name: "Munich Airport", code: "MUC", city: "Munich", country: "Germany", lat: 48.3537, lng: 11.7750 },
  { name: "Berlin Brandenburg", code: "BER", city: "Berlin", country: "Germany", lat: 52.3667, lng: 13.5033 },
  { name: "Amsterdam Schiphol", code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lng: 4.7683 },
  { name: "Madrid-Barajas", code: "MAD", city: "Madrid", country: "Spain", lat: 40.4983, lng: -3.5676 },
  { name: "Barcelona-El Prat", code: "BCN", city: "Barcelona", country: "Spain", lat: 41.2974, lng: 2.0833 },
  { name: "Rome Fiumicino", code: "FCO", city: "Rome", country: "Italy", lat: 41.8003, lng: 12.2389 },
  { name: "Milan Malpensa", code: "MXP", city: "Milan", country: "Italy", lat: 45.6306, lng: 8.7231 },
  { name: "Venice Marco Polo", code: "VCE", city: "Venice", country: "Italy", lat: 45.5053, lng: 12.3519 },
  { name: "Zurich Airport", code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.4647, lng: 8.5492 },
  { name: "Geneva Airport", code: "GVA", city: "Geneva", country: "Switzerland", lat: 46.2381, lng: 6.1089 },
  { name: "Vienna International", code: "VIE", city: "Vienna", country: "Austria", lat: 48.1103, lng: 16.5697 },
  { name: "Istanbul Airport", code: "IST", city: "Istanbul", country: "Turkey", lat: 41.2753, lng: 28.7519 },
  { name: "Moscow Sheremetyevo", code: "SVO", city: "Moscow", country: "Russia", lat: 55.9726, lng: 37.4146 },
  { name: "Dublin Airport", code: "DUB", city: "Dublin", country: "Ireland", lat: 53.4264, lng: -6.2499 },
  { name: "Lisbon Portela Airport", code: "LIS", city: "Lisbon", country: "Portugal", lat: 38.7813, lng: -9.1359 },
  { name: "Athens International", code: "ATH", city: "Athens", country: "Greece", lat: 37.9364, lng: 23.9467 },
  { name: "Santorini Airport", code: "JTR", city: "Santorini", country: "Greece", lat: 36.3992, lng: 25.4793 },
  { name: "Copenhagen Airport", code: "CPH", city: "Copenhagen", country: "Denmark", lat: 55.6180, lng: 12.6508 },
  { name: "Stockholm Arlanda", code: "ARN", city: "Stockholm", country: "Sweden", lat: 59.6519, lng: 17.9186 },
  { name: "Oslo Gardermoen", code: "OSL", city: "Oslo", country: "Norway", lat: 60.1939, lng: 11.1004 },
  { name: "Helsinki-Vantaa", code: "HEL", city: "Helsinki", country: "Finland", lat: 60.3172, lng: 24.9633 },
  { name: "Brussels Airport", code: "BRU", city: "Brussels", country: "Belgium", lat: 50.9014, lng: 4.4844 },
  { name: "Prague Airport", code: "PRG", city: "Prague", country: "Czech Republic", lat: 50.1008, lng: 14.2600 },
  { name: "Warsaw Chopin", code: "WAW", city: "Warsaw", country: "Poland", lat: 52.1657, lng: 20.9671 },
  { name: "Budapest Ferenc Liszt", code: "BUD", city: "Budapest", country: "Hungary", lat: 47.4369, lng: 19.2556 },
  { name: "Reykjavik Keflavik", code: "KEF", city: "Reykjavik", country: "Iceland", lat: 63.9850, lng: -22.6056 },

  // ==================== NORTH AMERICA ====================
  { name: "John F. Kennedy International", code: "JFK", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
  { name: "Newark Liberty International", code: "EWR", city: "Newark", country: "USA", lat: 40.6895, lng: -74.1745 },
  { name: "LaGuardia Airport", code: "LGA", city: "New York", country: "USA", lat: 40.7769, lng: -73.8740 },
  { name: "Los Angeles International", code: "LAX", city: "Los Angeles", country: "USA", lat: 33.9425, lng: -118.4081 },
  { name: "San Francisco International", code: "SFO", city: "San Francisco", country: "USA", lat: 37.6213, lng: -122.3790 },
  { name: "Chicago O'Hare International", code: "ORD", city: "Chicago", country: "USA", lat: 41.9742, lng: -87.9073 },
  { name: "Miami International", code: "MIA", city: "Miami", country: "USA", lat: 25.7959, lng: -80.2870 },
  { name: "Dallas/Fort Worth International", code: "DFW", city: "Dallas", country: "USA", lat: 32.8998, lng: -97.0403 },
  { name: "Denver International", code: "DEN", city: "Denver", country: "USA", lat: 39.8561, lng: -104.6737 },
  { name: "Seattle-Tacoma International", code: "SEA", city: "Seattle", country: "USA", lat: 47.4502, lng: -122.3088 },
  { name: "Atlanta Hartsfield-Jackson", code: "ATL", city: "Atlanta", country: "USA", lat: 33.6407, lng: -84.4277 },
  { name: "Boston Logan International", code: "BOS", city: "Boston", country: "USA", lat: 42.3656, lng: -71.0096 },
  { name: "Las Vegas Harry Reid", code: "LAS", city: "Las Vegas", country: "USA", lat: 36.0840, lng: -115.1537 },
  { name: "Orlando International", code: "MCO", city: "Orlando", country: "USA", lat: 28.4312, lng: -81.3081 },
  { name: "Honolulu Daniel K. Inouye", code: "HNL", city: "Honolulu", country: "USA", lat: 21.3187, lng: -157.9225 },
  { name: "Washington Dulles", code: "IAD", city: "Washington", country: "USA", lat: 38.9531, lng: -77.4565 },
  { name: "Philadelphia International", code: "PHL", city: "Philadelphia", country: "USA", lat: 39.8744, lng: -75.2424 },
  { name: "Toronto Pearson International", code: "YYZ", city: "Toronto", country: "Canada", lat: 43.6777, lng: -79.6248 },
  { name: "Vancouver International", code: "YVR", city: "Vancouver", country: "Canada", lat: 49.1947, lng: -123.1792 },
  { name: "Montreal-Trudeau International", code: "YUL", city: "Montreal", country: "Canada", lat: 45.4706, lng: -73.7408 },
  { name: "Calgary International", code: "YYC", city: "Calgary", country: "Canada", lat: 51.1215, lng: -114.0076 },
  { name: "Mexico City International", code: "MEX", city: "Mexico City", country: "Mexico", lat: 19.4363, lng: -99.0721 },
  { name: "Cancun International", code: "CUN", city: "Cancun", country: "Mexico", lat: 21.0365, lng: -86.8771 },

  // ==================== CARIBBEAN ====================
  { name: "Nassau Lynden Pindling", code: "NAS", city: "Nassau", country: "Bahamas", lat: 25.0390, lng: -77.4662 },
  { name: "Montego Bay Sangster", code: "MBJ", city: "Montego Bay", country: "Jamaica", lat: 18.5037, lng: -77.9134 },
  { name: "Punta Cana International", code: "PUJ", city: "Punta Cana", country: "Dominican Republic", lat: 18.5674, lng: -68.3634 },

  // ==================== SOUTH AMERICA ====================
  { name: "São Paulo-Guarulhos International", code: "GRU", city: "São Paulo", country: "Brazil", lat: -23.4356, lng: -46.4731 },
  { name: "Rio de Janeiro Galeão", code: "GIG", city: "Rio de Janeiro", country: "Brazil", lat: -22.8099, lng: -43.2506 },
  { name: "Buenos Aires Ezeiza", code: "EZE", city: "Buenos Aires", country: "Argentina", lat: -34.8222, lng: -58.5358 },
  { name: "El Dorado International", code: "BOG", city: "Bogotá", country: "Colombia", lat: 4.7016, lng: -74.1469 },
  { name: "Jorge Chávez International", code: "LIM", city: "Lima", country: "Peru", lat: -12.0219, lng: -77.1143 },
  { name: "Arturo Merino Benítez International", code: "SCL", city: "Santiago", country: "Chile", lat: -33.3930, lng: -70.7858 },
  { name: "Machu Picchu Alejandro Velasco", code: "CUZ", city: "Cusco", country: "Peru", lat: -13.5357, lng: -71.9388 },

  // ==================== AUSTRALIA & OCEANIA ====================
  { name: "Sydney Kingsford Smith", code: "SYD", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753 },
  { name: "Melbourne Airport", code: "MEL", city: "Melbourne", country: "Australia", lat: -37.6690, lng: 144.8410 },
  { name: "Brisbane Airport", code: "BNE", city: "Brisbane", country: "Australia", lat: -27.3842, lng: 153.1175 },
  { name: "Perth Airport", code: "PER", city: "Perth", country: "Australia", lat: -31.9403, lng: 115.9669 },
  { name: "Auckland Airport", code: "AKL", city: "Auckland", country: "New Zealand", lat: -37.0082, lng: 174.7850 },
  { name: "Queenstown Airport", code: "ZQN", city: "Queenstown", country: "New Zealand", lat: -45.0211, lng: 168.7392 },
  { name: "Fiji Nadi International", code: "NAN", city: "Nadi", country: "Fiji", lat: -17.7553, lng: 177.4431 },

  // ==================== AFRICA ====================
  { name: "O. R. Tambo International", code: "JNB", city: "Johannesburg", country: "South Africa", lat: -26.1392, lng: 28.2460 },
  { name: "Cape Town International", code: "CPT", city: "Cape Town", country: "South Africa", lat: -33.9649, lng: 18.6017 },
  { name: "Cairo International", code: "CAI", city: "Cairo", country: "Egypt", lat: 30.1219, lng: 31.4056 },
  { name: "Jomo Kenyatta International", code: "NBO", city: "Nairobi", country: "Kenya", lat: -1.3192, lng: 36.9278 },
  { name: "Mohammed V International", code: "CMN", city: "Casablanca", country: "Morocco", lat: 33.3675, lng: -7.5897 },
  { name: "Addis Ababa Bole International", code: "ADD", city: "Addis Ababa", country: "Ethiopia", lat: 8.9778, lng: 38.7994 },
  { name: "Lagos Murtala Muhammed", code: "LOS", city: "Lagos", country: "Nigeria", lat: 6.5774, lng: 3.3212 },
  { name: "Marrakech Menara Airport", code: "RAK", city: "Marrakech", country: "Morocco", lat: 31.6069, lng: -8.0363 },
  { name: "Victoria Falls Airport", code: "VFA", city: "Victoria Falls", country: "Zimbabwe", lat: -18.0959, lng: 25.8390 },
  { name: "Kilimanjaro International", code: "JRO", city: "Kilimanjaro", country: "Tanzania", lat: -3.4294, lng: 37.0745 },

  // ==================== MALDIVES & SRI LANKA ====================
  { name: "Velana International Airport", code: "MLE", city: "Malé", country: "Maldives", lat: 4.1918, lng: 73.5290 },
  { name: "Bandaranaike International", code: "CMB", city: "Colombo", country: "Sri Lanka", lat: 7.1808, lng: 79.8841 },

  // ==================== NEPAL & BHUTAN ====================
  { name: "Tribhuvan International", code: "KTM", city: "Kathmandu", country: "Nepal", lat: 27.6966, lng: 85.3591 },
  { name: "Paro International", code: "PBH", city: "Paro", country: "Bhutan", lat: 27.4033, lng: 89.4246 },
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
export function calculateFlightDuration(distance: number): number {
  const cruisingSpeedKmh = 870
  const taxiAndProceduresMinutes = 30

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

// Get popular routes for quick selection - Famous international routes
export function getPopularRoutes(): { origin: string; destination: string; label: string }[] {
  return [
    // Indian Domestic Routes
    { origin: "DEL", destination: "BOM", label: "Delhi → Mumbai" },
    { origin: "BOM", destination: "BLR", label: "Mumbai → Bangalore" },
    { origin: "DEL", destination: "GOI", label: "Delhi → Goa" },
    // India International
    { origin: "BOM", destination: "DXB", label: "Mumbai → Dubai" },
    { origin: "DEL", destination: "SIN", label: "Delhi → Singapore" },
    { origin: "BLR", destination: "LHR", label: "Bangalore → London" },
    // Famous International
    { origin: "JFK", destination: "LHR", label: "New York → London" },
    { origin: "LAX", destination: "NRT", label: "LA → Tokyo" },
    { origin: "SIN", destination: "SYD", label: "Singapore → Sydney" },
    { origin: "DXB", destination: "JFK", label: "Dubai → New York" },
    { origin: "CDG", destination: "JFK", label: "Paris → New York" },
    { origin: "LHR", destination: "HKG", label: "London → Hong Kong" },
    // Dream Destinations
    { origin: "DEL", destination: "MLE", label: "Delhi → Maldives" },
    { origin: "SIN", destination: "DPS", label: "Singapore → Bali" },
    { origin: "JFK", destination: "FCO", label: "New York → Rome" },
    { origin: "LHR", destination: "JTR", label: "London → Santorini" },
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
