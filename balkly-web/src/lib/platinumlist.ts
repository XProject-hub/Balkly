/**
 * Platinumlist.net API Integration
 * 
 * This service integrates with Platinumlist to fetch events and experiences
 * with affiliate referral links.
 * 
 * Affiliate Referral: https://platinumlist.net/aff/?ref=zjblytn&link=
 * 
 * AUTOMATION OPTIONS:
 * 1. XML Feed: https://bit.ly/pl_events (All upcoming events)
 * 2. Attractions Landings: https://bit.ly/attractions-landings
 * 3. Direct Website: https://platinumlist.net/ (requires scraping)
 * 
 * RECOMMENDED: Use XML feed for automatic daily updates
 * 
 * To enable automatic updates:
 * - Set up a cron job in Laravel to fetch XML feed daily
 * - Parse XML and store as affiliate events in database
 * - Frontend automatically shows latest events
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

/**
 * Generate affiliate link for a Platinumlist event
 * Correct format from official docs: https://attraction.platinumlist.net/?ref=yourref
 */
export function generateAffiliateLink(eventUrl: string): string {
  // Ensure URL has https://
  const fullUrl = eventUrl.startsWith('http') ? eventUrl : `https://${eventUrl}`;
  // Add ref parameter at the end
  return `${fullUrl}/?ref=${AFFILIATE_REF}`;
}

/**
 * Mock data for Platinumlist events (until API is available)
 * This is based on the Looker Studio data reference provided
 */
const MOCK_PLATINUMLIST_EVENTS: PlatinumListEvent[] = [
  // Official Platinumlist Attractions from Spreadsheet
  {
    id: 'pl-burj-khalifa',
    title: 'Burj Khalifa',
    description: 'Visit the world\'s tallest building! Experience breathtaking 360-degree views from the observation decks. Multi-language support: English, Arabic, Russian, Hebrew, German, Spanish, Polish, French, Italian.',
    image_url: 'https://source.unsplash.com/800x600/?burj-khalifa,dubai',
    venue: 'Burj Khalifa',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T09:00:00Z',
    end_date: '2026-12-31T23:00:00Z',
    category: 'Attractions',
    url: 'burj-khalifa.platinumlist.net',
    price: {
      min: 149,
      max: 379,
      currency: 'AED',
    },
  },
  {
    id: 'pl-skydive',
    title: 'Skydive Dubai',
    description: 'Experience the ultimate adrenaline rush! Tandem skydiving over Dubai. Multi-language support: English, Russian, German, French.',
    image_url: 'https://source.unsplash.com/800x600/?skydiving,dubai',
    venue: 'Skydive Dubai',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T07:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Adventure',
    url: 'skydive.platinumlist.net',
    price: {
      min: 1699,
      max: 2199,
      currency: 'AED',
    },
  },
  {
    id: 'pl-atlantis',
    title: 'Atlantis Aquaventure',
    description: 'Middle East\'s #1 waterpark at Atlantis The Palm! Thrilling slides, marine experiences, and beach access. Languages: English, German, French.',
    image_url: 'https://source.unsplash.com/800x600/?waterpark,atlantis,dubai',
    venue: 'Atlantis The Palm',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Water Parks',
    url: 'altantiswaterpark.platinumlist.net',
    price: {
      min: 299,
      max: 399,
      currency: 'AED',
    },
  },
  {
    id: 'pl-img-world',
    title: 'IMG Worlds of Adventure',
    description: 'World\'s largest indoor theme park! Marvel, Cartoon Network, and thrilling rides. Perfect for families.',
    image_url: 'https://source.unsplash.com/800x600/?theme-park,amusement',
    venue: 'IMG Worlds',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T11:00:00Z',
    end_date: '2026-12-31T21:00:00Z',
    category: 'Theme Parks',
    url: 'imgworld.platinumlist.net',
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
    image_url: 'https://source.unsplash.com/800x600/?burj-al-arab,luxury-hotel',
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
    image_url: 'https://source.unsplash.com/800x600/?safari,wildlife,animals',
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
    image_url: 'https://source.unsplash.com/800x600/?dubai-frame,architecture',
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
    image_url: 'https://source.unsplash.com/800x600/?skiing,snow,winter',
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
    image_url: 'https://source.unsplash.com/800x600/?zipline,mountain,adventure',
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
    image_url: 'https://source.unsplash.com/800x600/?garden,flowers,dubai',
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
    image_url: 'https://source.unsplash.com/800x600/?helicopter,dubai,aerial',
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
    image_url: 'https://source.unsplash.com/800x600/?palm-jumeirah,dubai,view',
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
    image_url: 'https://source.unsplash.com/800x600/?desert,safari,dubai',
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
    image_url: 'https://source.unsplash.com/800x600/?museum,dubai,culture',
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
    title: 'Water Sports in UAE',
    description: 'Jet skiing, parasailing, flyboarding, and more! Experience Dubai\'s coastline with exciting water sports.',
    image_url: 'https://source.unsplash.com/800x600/?water-sports,jet-ski,dubai',
    venue: 'Various Beaches',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T08:00:00Z',
    end_date: '2026-12-31T18:00:00Z',
    category: 'Water Sports',
    url: 'watersports.platinumlist.net',
    price: {
      min: 100,
      max: 500,
      currency: 'AED',
    },
  },
  // Additional attractions from Platinumlist
  {
    id: 'pl-dreamland',
    title: 'Dreamland Aqua Park',
    description: 'Family-friendly waterpark with exciting slides and attractions! Perfect day out for the whole family.',
    image_url: 'https://source.unsplash.com/800x600/?waterpark,slides,family',
    venue: 'Dreamland Aqua Park',
    city: 'Umm Al Quwain',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-09-30T18:00:00Z',
    category: 'Water Parks',
    url: 'dreamlandaquaparktickets.platinumlist.net',
    price: {
      min: 95,
      max: 120,
      currency: 'AED',
    },
  },
  {
    id: 'pl-theme-parks',
    title: 'Theme Parks in Dubai & Abu Dhabi',
    description: 'Explore all major theme parks in UAE! Ferrari World, Yas Waterworld, Warner Bros, and more. Multi-language.',
    image_url: 'https://source.unsplash.com/800x600/?theme-park,amusement',
    venue: 'Multiple Locations',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-12-31T20:00:00Z',
    category: 'Theme Parks',
    url: 'themeparksdubai.platinumlist.net',
    price: {
      min: 195,
      max: 395,
      currency: 'AED',
    },
  },
  {
    id: 'pl-water-parks-dubai',
    title: 'Dubai Water Parks',
    description: 'Access to Dubai\'s best waterparks - Aquaventure, Wild Wadi, Laguna Waterpark, and more!',
    image_url: 'https://source.unsplash.com/800x600/?waterpark,slides,family',
    venue: 'Multiple Parks',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T10:00:00Z',
    end_date: '2026-10-31T19:00:00Z',
    category: 'Water Parks',
    url: 'waterparksdubai.platinumlist.net',
    price: {
      min: 150,
      max: 350,
      currency: 'AED',
    },
  },
  {
    id: 'pl-boat-cruises',
    title: 'Boat Tours and Cruises',
    description: 'Dubai Marina cruises, Dhow dinner cruises, yacht rentals, and boat tours. Experience Dubai from the water!',
    image_url: 'https://source.unsplash.com/800x600/?boat,cruise,dubai-marina',
    venue: 'Dubai Marina',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T17:00:00Z',
    end_date: '2026-12-31T23:00:00Z',
    category: 'Tours',
    url: 'boatscruises.platinumlist.net',
    price: {
      min: 75,
      max: 450,
      currency: 'AED',
    },
  },
  {
    id: 'pl-desert-safari-best',
    title: 'Desert Safaris',
    description: 'Best desert safari experiences in Dubai! Dune bashing, camel rides, BBQ dinner, and entertainment. Multiple languages.',
    image_url: 'https://source.unsplash.com/800x600/?desert,safari,dubai',
    venue: 'Dubai Desert',
    city: 'Dubai',
    country: 'AE',
    start_date: '2025-11-17T14:00:00Z',
    end_date: '2026-12-31T22:00:00Z',
    category: 'Desert Activities',
    url: 'bestdubaisafari.platinumlist.net',
    price: {
      min: 120,
      max: 350,
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
 * Fetch Platinumlist events from XML feed (for automation)
 * 
 * NOTE: To enable automatic updates from Platinumlist:
 * 1. Create a Laravel command: php artisan make:command FetchPlatinumlistEvents
 * 2. Fetch XML from: https://bit.ly/pl_events
 * 3. Parse XML and save as affiliate events in database
 * 4. Schedule in Laravel: Schedule::command('platinumlist:fetch')->daily()
 * 
 * This function will then fetch from YOUR database instead of mock data.
 */
export async function fetchPlatinumListEvents(filters?: {
  city?: string;
  category?: string;
  limit?: number;
}): Promise<BalklyEvent[]> {
  // TODO: Replace with database call when XML sync is implemented
  // For now, using mock data with real Platinumlist attractions
  
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

