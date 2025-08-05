import { BlogService } from '@/features/adhdnsw/services/blog.service'

export async function GET() {
  const rss = await BlogService.generateRSSFeed()
  
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}