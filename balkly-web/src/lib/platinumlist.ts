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
  // Top Attractions from Platinumlist
  {
    id: 'pl-burj-khalifa',
    title: 'Burj Khalifa - At The Top Experience',
    description: 'Visit the world\'s tallest building! Experience breathtaking 360-degree views from levels 124 & 125. Book your tickets now for the ultimate Dubai experience.',
    image_url: 'https://cdn.pixabay.com/photo/2020/02/03/00/12/burj-khalifa-4814842_1280.jpg',
    venue: 'Burj Khalifa',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T23:00:00Z',
    category: 'Attractions',
    url: 'https://burj-khalifa.platinumlist.net',
    price: {
      min: 149,
      max: 379,
      currency: 'AED',
    },
  },
  {
    id: 'pl-skydive',
    title: 'Skydive Dubai - Tandem Jump',
    description: 'Experience the thrill of a lifetime with Skydive Dubai! Jump from 13,000 feet over the iconic Palm Jumeirah. No experience needed - tandem jumps available.',
    image_url: 'https://cdn.pixabay.com/photo/2016/11/29/13/15/aircraft-1870374_1280.jpg',
    venue: 'Skydive Dubai',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T07:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Adventure',
    url: 'https://skydive.platinumlist.net',
    price: {
      min: 1699,
      max: 2199,
      currency: 'AED',
    },
  },
  {
    id: 'pl-atlantis',
    title: 'Atlantis Aquaventure Waterpark',
    description: 'Experience the Middle East\'s #1 waterpark! Featuring thrilling slides, private beach access, and underwater adventures. Perfect for families.',
    image_url: 'https://cdn.pixabay.com/photo/2020/02/08/14/29/atlantis-4829924_1280.jpg',
    venue: 'Atlantis The Palm',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Water Parks',
    url: 'https://altantiswaterpark.platinumlist.net',
    price: {
      min: 299,
      max: 399,
      currency: 'AED',
    },
  },
  {
    id: 'pl-img-world',
    title: 'IMG Worlds of Adventure',
    description: 'World\'s largest indoor theme park! Meet Marvel Super Heroes, explore Cartoon Network zone, and experience thrilling rides. All-weather entertainment.',
    image_url: 'https://cdn.pixabay.com/photo/2017/11/12/13/28/amusement-park-2943408_1280.jpg',
    venue: 'IMG Worlds',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T11:00:00Z',
    end_date: '2026-12-31T21:00:00Z',
    category: 'Theme Parks',
    url: 'https://imgworld.platinumlist.net',
    price: {
      min: 295,
      max: 345,
      currency: 'AED',
    },
  },
  {
    id: 'pl-burj-al-arab',
    title: 'Guided Tours Inside Burj Al Arab',
    description: 'Exclusive inside access to the world\'s most luxurious hotel! Discover the opulence of Burj Al Arab with professional guided tours.',
    image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    venue: 'Burj Al Arab',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T17:00:00Z',
    category: 'Tours',
    url: 'https://burjalarab.platinumlist.net',
    price: {
      min: 399,
      max: 599,
      currency: 'AED',
    },
  },
  {
    id: 'pl-safari-park',
    title: 'Dubai Safari Park',
    description: 'Explore wildlife from around the world! Home to over 3,000 animals across African, Asian, and Arabian villages. Educational and fun for all ages.',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    venue: 'Dubai Safari Park',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-05-31T17:00:00Z',
    category: 'Wildlife',
    url: 'https://dubaisafaripark.platinumlist.net',
    price: {
      min: 50,
      max: 85,
      currency: 'AED',
    },
  },
  {
    id: 'pl-dubai-frame',
    title: 'Dubai Frame - Sky Bridge & Gallery',
    description: 'Walk on the iconic 150m high Sky Bridge! Dubai Frame offers stunning views of old and new Dubai, plus interactive exhibitions.',
    image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    venue: 'Dubai Frame',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T21:00:00Z',
    category: 'Landmarks',
    url: 'https://dubaiframe.platinumlist.net',
    price: {
      min: 50,
      max: 50,
      currency: 'AED',
    },
  },
  {
    id: 'pl-ski-dubai',
    title: 'Ski Dubai - Snow Park & Skiing',
    description: 'Ski in the desert! Indoor snow park with 5 ski runs, snowboarding, penguin encounters, and snow activities. Escape the heat!',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    venue: 'Mall of the Emirates',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-12-31T23:00:00Z',
    category: 'Indoor Activities',
    url: 'https://skidubai.platinumlist.net',
    price: {
      min: 180,
      max: 450,
      currency: 'AED',
    },
  },
  {
    id: 'pl-jebel-jais',
    title: 'Jebel Jais Flight - World\'s Longest Zipline',
    description: 'Fly at 150 km/h on the world\'s longest zipline! 2.83km of pure adrenaline at UAE\'s highest mountain peak. Unforgettable adventure!',
    image_url: 'https://images.unsplash.com/photo-1567562606071-7474ea96bea1?w=800',
    venue: 'Jebel Jais Mountain',
    city: 'Ras Al Khaimah',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T17:00:00Z',
    category: 'Adventure',
    url: 'https://jebeljaisflight.platinumlist.net',
    price: {
      min: 650,
      max: 650,
      currency: 'AED',
    },
  },
  {
    id: 'pl-miracle-garden',
    title: 'Dubai Miracle Garden',
    description: 'World\'s largest flower garden! Marvel at 150 million flowers arranged in stunning displays. Seasonal opening - don\'t miss it!',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    venue: 'Dubai Miracle Garden',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-05-15T21:00:00Z',
    category: 'Gardens',
    url: 'https://miraclegarden.platinumlist.net',
    price: {
      min: 75,
      max: 95,
      currency: 'AED',
    },
  },
  {
    id: 'pl-helicopter',
    title: 'Dubai Helicopter Tour',
    description: 'See Dubai from the sky! Fly over Burj Khalifa, Palm Jumeirah, and Burj Al Arab. Choose from 12, 17, 22, or 40-minute flights.',
    image_url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=800',
    venue: 'Helidubai',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T08:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Tours',
    url: 'https://dubaihelicoptertour.platinumlist.net',
    price: {
      min: 645,
      max: 1999,
      currency: 'AED',
    },
  },
  {
    id: 'pl-view-palm',
    title: 'The View at The Palm',
    description: 'Breathtaking 360° views from the 52nd floor of Palm Tower! Experience the observation deck 240 meters above Palm Jumeirah.',
    image_url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800',
    venue: 'Palm Tower',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-12-31T22:00:00Z',
    category: 'Observation Decks',
    url: 'https://viewthepalm.platinumlist.net',
    price: {
      min: 100,
      max: 150,
      currency: 'AED',
    },
  },
  {
    id: 'pl-desert-safari',
    title: 'Premium Desert Safari with BBQ Dinner',
    description: 'Authentic Arabian experience! Dune bashing, camel rides, sandboarding, henna painting, and traditional BBQ dinner under the stars.',
    image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
    venue: 'Dubai Desert',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T14:00:00Z',
    end_date: '2026-12-31T22:00:00Z',
    category: 'Desert Activities',
    url: 'https://bestdubaisafari.platinumlist.net',
    price: {
      min: 150,
      max: 350,
      currency: 'AED',
    },
  },
  {
    id: 'pl-dubai-museums',
    title: 'Dubai Museums & Heritage Tours',
    description: 'Discover Dubai\'s rich history! Visit Dubai Museum, Al Fahidi District, and traditional souks. Cultural immersion at its best.',
    image_url: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800',
    venue: 'Various Museums',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T17:00:00Z',
    category: 'Cultural',
    url: 'https://dubaimuseums.platinumlist.net',
    price: {
      min: 25,
      max: 150,
      currency: 'AED',
    },
  },
  {
    id: 'pl-water-sports',
    title: 'Water Sports & Activities in UAE',
    description: 'Jet skiing, parasailing, flyboarding, and more! Experience Dubai\'s coastline with exciting water sports adventures.',
    image_url: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=800',
    venue: 'Various Beaches',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T08:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Water Sports',
    url: 'https://watersports.platinumlist.net',
    price: {
      min: 100,
      max: 500,
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

