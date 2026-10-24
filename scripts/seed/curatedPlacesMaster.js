import { northPlaces } from './placesByRegion/north.js'
import { southPlaces } from './placesByRegion/south.js'
import { westPlaces } from './placesByRegion/west.js'
import { eastPlaces } from './placesByRegion/east.js'
import { centralPlaces } from './placesByRegion/central.js'
import { northeastPlaces } from './placesByRegion/northeast.js'

export const allIndiaCuratedPlaces = [
  ...northPlaces,
  ...southPlaces,
  ...westPlaces,
  ...eastPlaces,
  ...centralPlaces,
  ...northeastPlaces,
]

// State to Region lookup
export const REGION_MAPPING = {
  'North': ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh'],
  'South': ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Lakshadweep'],
  'West': ['Maharashtra', 'Rajasthan', 'Gujarat', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
  'East': ['Odisha', 'West Bengal', 'Bihar', 'Jharkhand', 'Andaman and Nicobar Islands'],
  'Central': ['Madhya Pradesh', 'Chhattisgarh'],
  'Northeast': ['Assam', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'],
}

// Bounding box of India: Lat 6.0 to 37.5, Lng 68.0 to 97.5
export function isInsideIndiaBounds(lat, lng) {
  return lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5
}
