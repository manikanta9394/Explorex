/**
 * Category-specific fallback images from high-resolution Unsplash travel collections.
 * Styled and cropped consistently with real place photos.
 */
export const FALLBACK_IMAGES = {
  attraction: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', // Heritage Monument / Taj Mahal style
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // Luxury Hotel / Resort
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // Fine Dining Restaurant
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Food / Table spread
  default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', // Scenic Travel Landscape
}

/**
 * Returns a matching fallback image URL based on category or item type
 */
export function getFallbackImage(category = '', type = '') {
  const cat = (category || type || '').toLowerCase()

  if (cat.includes('hotel') || cat.includes('resort') || cat.includes('palace hotel') || cat.includes('stay')) {
    return FALLBACK_IMAGES.hotel
  }
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('cafe') || cat.includes('bistro')) {
    return FALLBACK_IMAGES.restaurant
  }
  if (cat.includes('food') || cat.includes('cuisine') || cat.includes('biryani') || cat.includes('snack')) {
    return FALLBACK_IMAGES.food
  }
  if (
    cat.includes('monument') ||
    cat.includes('heritage') ||
    cat.includes('fort') ||
    cat.includes('attraction') ||
    cat.includes('museum') ||
    cat.includes('tomb') ||
    cat.includes('temple') ||
    cat.includes('palace')
  ) {
    return FALLBACK_IMAGES.attraction
  }

  return FALLBACK_IMAGES.default
}
