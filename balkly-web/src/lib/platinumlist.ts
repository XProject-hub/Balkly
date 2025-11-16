/**
 * Platinumlist.net API Integration
 * 
 * This service integrates with Platinumlist to fetch events and experiences
 * with affiliate referral links.
 * 
 * Affiliate Referral: https://platinumlist.net/aff/?ref=zjblytn&link=
 */

interface PlatinumListEvent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  venue?: string;
  city?: string;
  country?: string;
  start_date: string;
  end_date?: string;
  category?: string;
  url: string;
  price?: {
    min?: number;
    max?: number;
    currency: string;
  };
}

interface BalklyEvent {
  id: string;
  type: 'affiliate' | 'own';
  title: string;
  slug?: string;
  description: string;
  image_url?: string;
  venue?: string;
  city?: string;
  country?: string;
  start_at: string;
  end_at?: string;
  partner_url: string;
  partner_ref?: string;
  status: 'published';
  metadata?: any;
}

const AFFILIATE_REF = 'zjblytn';
const AFFILIATE_BASE = 'https://platinumlist.net/aff/?ref=';

/**
 * Generate affiliate link for a Platinumlist event
 */
export function generateAffiliateLink(eventUrl: string): string {
  return `${AFFILIATE_BASE}${AFFILIATE_REF}&link=${encodeURIComponent(eventUrl)}`;
}

/**
 * Mock data for Platinumlist events (until API is available)
 * This is based on the Looker Studio data reference provided
 */
const MOCK_PLATINUMLIST_EVENTS: PlatinumListEvent[] = [
  {
    id: 'pl-1',
    title: 'Dubai Jazz Festival 2025',
    description: 'Experience the best jazz performances from around the world in the heart of Dubai.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    venue: 'Dubai Media City Amphitheatre',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-12-15T19:00:00Z',
    end_date: '2025-12-17T23:00:00Z',
    category: 'Music',
    url: 'https://platinumlist.net/events/dubai-jazz-festival-2025',
    price: {
      min: 150,
      max: 500,
      currency: 'AED',
    },
  },
  {
    id: 'pl-2',
    title: 'Abu Dhabi Food Festival',
    description: 'Celebrate culinary excellence with top chefs and restaurants from the UAE and beyond.',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    venue: 'Yas Island',
    city: 'Abu Dhabi',
    country: 'AE',
    start_date: '2025-11-25T10:00:00Z',
    end_date: '2025-11-30T22:00:00Z',
    category: 'Food & Drink',
    url: 'https://platinumlist.net/events/abu-dhabi-food-festival',
    price: {
      min: 50,
      max: 300,
      currency: 'AED',
    },
  },
  {
    id: 'pl-3',
    title: 'Sharjah Light Festival',
    description: 'A spectacular light and art show illuminating the historic buildings of Sharjah.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    venue: 'Various Locations',
    city: 'Sharjah',
    country: 'AE',
    start_date: '2025-12-01T18:00:00Z',
    end_date: '2025-12-10T23:00:00Z',
    category: 'Arts & Culture',
    url: 'https://platinumlist.net/events/sharjah-light-festival',
    price: {
      min: 0,
      currency: 'AED',
    },
  },
  {
    id: 'pl-4',
    title: 'Dubai Comedy Night',
    description: 'An evening of laughter with international and regional comedy stars.',
    image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    venue: 'The Theater at Mall of the Emirates',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-22T20:00:00Z',
    category: 'Comedy',
    url: 'https://platinumlist.net/events/dubai-comedy-night',
    price: {
      min: 100,
      max: 250,
      currency: 'AED',
    },
  },
  {
    id: 'pl-5',
    title: 'Emirates Stadium Tour & Museum',
    description: 'Behind-the-scenes access to one of the most iconic football venues.',
    image_url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
    venue: 'Emirates Stadium',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-20T09:00:00Z',
    end_date: '2025-12-31T17:00:00Z',
    category: 'Sports',
    url: 'https://platinumlist.net/events/emirates-stadium-tour',
    price: {
      min: 75,
      max: 150,
      currency: 'AED',
    },
  },
  {
    id: 'pl-6',
    title: 'Balkan Night Dubai',
    description: 'Traditional music, food, and dance celebrating Balkan culture in the UAE.',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    venue: 'Madinat Jumeirah',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-12-05T19:00:00Z',
    category: 'Cultural',
    url: 'https://platinumlist.net/events/balkan-night-dubai',
    price: {
      min: 120,
      max: 200,
      currency: 'AED',
    },
  },
];

/**
 * Convert Platinumlist event to Balkly event format
 */
function convertPlatinumListEvent(plEvent: PlatinumListEvent): BalklyEvent {
  const affiliateLink = generateAffiliateLink(plEvent.url);
  
  return {
    id: plEvent.id,
    type: 'affiliate',
    title: plEvent.title,
    slug: plEvent.id,
    description: plEvent.description,
    image_url: plEvent.image_url,
    venue: plEvent.venue,
    city: plEvent.city,
    country: plEvent.country,
    start_at: plEvent.start_date,
    end_at: plEvent.end_date,
    partner_url: affiliateLink,
    partner_ref: AFFILIATE_REF,
    status: 'published',
    metadata: {
      source: 'platinumlist',
      original_url: plEvent.url,
      category: plEvent.category,
      price: plEvent.price,
    },
  };
}

/**
 * Fetch Platinumlist events
 * Currently returns mock data - replace with actual API call when available
 */
export async function fetchPlatinumListEvents(filters?: {
  city?: string;
  category?: string;
  limit?: number;
}): Promise<BalklyEvent[]> {
  // TODO: Replace with actual API call when Platinumlist API is available
  // For now, using mock data
  
  let events = [...MOCK_PLATINUMLIST_EVENTS];

  // Apply filters
  if (filters?.city) {
    events = events.filter(e => 
      e.city?.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters?.category) {
    events = events.filter(e => 
      e.category?.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  if (filters?.limit) {
    events = events.slice(0, filters.limit);
  }

  // Convert to Balkly format
  return events.map(convertPlatinumListEvent);
}

/**
 * Get a single Platinumlist event by ID
 */
export async function getPlatinumListEvent(id: string): Promise<BalklyEvent | null> {
  const event = MOCK_PLATINUMLIST_EVENTS.find(e => e.id === id);
  if (!event) return null;
  return convertPlatinumListEvent(event);
}

/**
 * Track affiliate click (for analytics)
 */
export function trackAffiliateClick(eventId: string, eventTitle: string) {
  // Send analytics event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'affiliate',
      event_label: eventTitle,
      value: eventId,
    });
  }

  console.log(`[Affiliate] Click tracked for event: ${eventTitle} (${eventId})`);
}

