import { Calendar, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/shared/lib/utils'

import type { BlogPost } from '../../types'

interface BlogPostCardProps {
  post: BlogPost
  className?: string
  featured?: boolean
}

export function BlogPostCard({ post, className, featured = false }: BlogPostCardProps) {
  const readingTime = Math.ceil(post.content.split(' ').length / 200)
  
  if (featured) {
    return (
      <article className={cn("bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow", className)}>
        <div className="md:flex">
          {post.featuredImage && (
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          )}
          <div className="p-6 md:w-3/5">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Draft'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              <Link 
                href={`/blog/${post.slug}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            
            {post.excerpt && (
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}
            
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={cn("bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow", className)}>
      {post.featuredImage && (
        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-AU', {
              month: 'short',
              day: 'numeric'
            }) : 'Draft'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-foreground hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 2).map(category => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Tag className="h-3 w-3" />
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}