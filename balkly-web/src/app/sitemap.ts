import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balkly.live'
  
  // Static pages
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

  // Fetch dynamic pages from API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    // Get listings
    const listingsRes = await fetch(`${apiUrl}/api/v1/listings?per_page=100`, {
      next: { revalidate: 3600 }
    })
    const listingsData = await listingsRes.json()
    const listings = (listingsData.data || []).map((listing: any) => ({
      url: `${baseUrl}/listings/${listing.id}`,
      lastModified: new Date(listing.updated_at || listing.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    // Get events
    const eventsRes = await fetch(`${apiUrl}/api/v1/events?per_page=100`, {
      next: { revalidate: 3600 }
    })
    const eventsData = await eventsRes.json()
    const events = (eventsData.data || []).map((event: any) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.updated_at || event.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // Get forum topics
    const forumRes = await fetch(`${apiUrl}/api/v1/forum/topics?per_page=100`, {
      next: { revalidate: 3600 }
    })
    const forumData = await forumRes.json()
    const topics = (forumData.data || []).map((topic: any) => ({
      url: `${baseUrl}/forum/topics/${topic.id}`,
      lastModified: new Date(topic.updated_at || topic.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

    // Get KB articles
    const kbRes = await fetch(`${apiUrl}/api/v1/kb/categories`, {
      next: { revalidate: 3600 }
    })
    const kbData = await kbRes.json()
    const kbArticles: MetadataRoute.Sitemap = []
    if (kbData.categories) {
      kbData.categories.forEach((cat: any) => {
        if (cat.articles) {
          cat.articles.forEach((article: any) => {
            kbArticles.push({
              url: `${baseUrl}/knowledge-base/${article.slug}`,
              lastModified: new Date(article.updated_at || article.created_at),
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            })
          })
        }
      })
    }

    return [...staticPages, ...listings, ...events, ...topics, ...kbArticles]
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap data:', error)
    return staticPages
  }
}
