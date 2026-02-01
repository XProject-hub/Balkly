import { MetadataRoute } from 'next'

// Helper to safely fetch JSON with error handling
async function safeFetch(url: string): Promise<any> {
  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    if (!res.ok) return null
    const text = await res.text()
    // Check if response is JSON (not HTML error page)
    if (text.startsWith('<') || text.startsWith('<!')) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balkly.live'
  
  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge-base`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // During build, API may not be available - return static pages only
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://balkly.live/api/v1'
  
  // Try to fetch dynamic content (will gracefully fail during build)
  const dynamicPages: MetadataRoute.Sitemap = []

  // Get listings
  const listingsData = await safeFetch(`${apiUrl}/listings?per_page=100`)
  if (listingsData?.data) {
    listingsData.data.forEach((listing: any) => {
      dynamicPages.push({
        url: `${baseUrl}/listings/${listing.id}`,
        lastModified: new Date(listing.updated_at || listing.created_at),
        changeFrequency: 'daily',
        priority: 0.7,
      })
    })
  }

  // Get events
  const eventsData = await safeFetch(`${apiUrl}/events?per_page=100`)
  if (eventsData?.data) {
    eventsData.data.forEach((event: any) => {
      dynamicPages.push({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: new Date(event.updated_at || event.created_at),
        changeFrequency: 'daily',
        priority: 0.8,
      })
    })
  }

  // Get forum topics
  const forumData = await safeFetch(`${apiUrl}/forum/topics?per_page=100`)
  if (forumData?.data) {
    forumData.data.forEach((topic: any) => {
      dynamicPages.push({
        url: `${baseUrl}/forum/topics/${topic.id}`,
        lastModified: new Date(topic.updated_at || topic.created_at),
        changeFrequency: 'daily',
        priority: 0.6,
      })
    })
  }

  // Get KB articles
  const kbData = await safeFetch(`${apiUrl}/kb/categories`)
  if (kbData?.categories) {
    kbData.categories.forEach((cat: any) => {
      if (cat.articles) {
        cat.articles.forEach((article: any) => {
          dynamicPages.push({
            url: `${baseUrl}/knowledge-base/${article.slug}`,
            lastModified: new Date(article.updated_at || article.created_at),
            changeFrequency: 'weekly',
            priority: 0.6,
          })
        })
      }
    })
  }

  return [...staticPages, ...dynamicPages]
}
