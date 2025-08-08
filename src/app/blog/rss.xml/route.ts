import { BlogService } from '@/features/adhdnsw/services/blog.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rss = await BlogService.generateRSSFeed()

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    // Return empty RSS feed if Supabase is not configured
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ADHD NSW Blog</title>
    <description>Latest ADHD news, guides, and resources for New South Wales</description>
    <link>https://adhdnsw.org/blog</link>
    <atom:link href="https://adhdnsw.org/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-AU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`

    return new Response(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
