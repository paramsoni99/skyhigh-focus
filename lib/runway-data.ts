export interface Runway {
  heading: number
  length: number
  width: number
}

export const AIRPORT_RUNWAYS: Record<string, Runway[]> = {
  // International airports with realistic runway configurations
  NRT: [
    { heading: 34, length: 4000, width: 60 },
    { heading: 16, length: 4000, width: 60 },
  ],
  LAX: [
    { heading: 25, length: 3884, width: 61 },
    { heading: 24, length: 3884, width: 61 },
  ],
  LHR: [
    { heading: 27, length: 3901, width: 79 },
    { heading: 9, length: 3658, width: 79 },
  ],
  CDG: [
    { heading: 26, length: 4400, width: 60 },
    { heading: 8, length: 4400, width: 60 },
  ],
  DXB: [
    { heading: 30, length: 4000, width: 60 },
    { heading: 12, length: 4000, width: 60 },
  ],
  SIN: [
    { heading: 20, length: 3800, width: 60 },
    { heading: 2, length: 3800, width: 60 },
  ],
  SYD: [
    { heading: 16, length: 3962, width: 60 },
    { heading: 34, length: 3962, width: 60 },
  ],
  JFK: [
    { heading: 4, length: 3886, width: 61 },
    { heading: 22, length: 4423, width: 61 },
  ],
  FRA: [
    { heading: 25, length: 4000, width: 80 },
    { heading: 7, length: 3944, width: 80 },
  ],
  HKG: [
    { heading: 25, length: 3800, width: 60 },
    { heading: 7, length: 3800, width: 60 },
  ],
  AMS: [
    { heading: 24, length: 3000, width: 61 },
    { heading: 6, length: 3000, width: 61 },
  ],
  BKK: [
    { heading: 3, length: 3700, width: 60 },
    { heading: 21, length: 3700, width: 60 },
  ],
  YYZ: [
    { heading: 24, length: 3823, width: 61 },
    { heading: 6, length: 3823, width: 61 },
  ],
  IST: [
    { heading: 28, length: 3000, width: 60 },
    { heading: 10, length: 3000, width: 60 },
  ],
  MEX: [
    { heading: 5, length: 3952, width: 61 },
    { heading: 23, length: 3952, width: 61 },
  ],
}

export function getRunwaysForAirport(airportCode: string): Runway[] {
  return AIRPORT_RUNWAYS[airportCode] || [{ heading: 0, length: 3500, width: 60 }]
}
