import PageTitle from '@/components/PageTitle'
import PostLayout from '@/layouts/PostLayout'
import { getPostBySlug } from '../../../utils/firebase'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'
import { Blog } from 'contentlayer/generated'
import { Authors } from 'contentlayer/generated'
import { CoreContent } from '../../../utils/CoreContent'

const defaultLayout = 'PostLayout'

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  try {
    const slugPath = params.slug ? params.slug.join('/') : ''
    const decodedSlug = decodeURI(slugPath)
    const post = await getPostBySlug(decodedSlug)
    
    if (!post) {
      return
    }

    const publishedAt = new Date(post.date).toISOString()
    const modifiedAt = publishedAt // Use same date if no lastmod

    return {
      title: post.title,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        siteName: siteMetadata.title,
        locale: 'en_US',
        type: 'article',
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        url: './',
        authors: [post.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.summary,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string[] }
}) {
  try {
    const slugPath = params.slug ? params.slug.join('/') : ''
    const decodedSlug = decodeURI(slugPath)
    const post = await getPostBySlug(decodedSlug)

    if (!post) {
      return notFound()
    }

    const authorDetails: CoreContent<Authors>[] = [{
      name: post.author,
      slug: 'default-author',
      path: '/authors/default-author',
      type: 'Authors' as const,
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
      filePath: '',
      toc: [],
      structuredData: {
        type: 'Person',
        articleBody: '',
        headline: post.author,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.date).toISOString(),
      }
    }]

    const mainContent: CoreContent<Blog> = {
      title: post.title,
      date: post.date,
      slug: post.slug,
      tags: post.tags,
      lastmod: post.date,
      draft: post.draft,
      summary: post.summary,
      authors: [post.author],
      path: `/blog/${post.slug}`,
      type: 'Blog' as const,
      readingTime: { 
        text: '5 min', 
        minutes: 5, 
        time: 300000, 
        words: 1000 
      },
      filePath: `blog/${post.slug}.mdx`,
      toc: [
        {
          value: post.title,
          depth: 1,
          url: `#${post.slug}`
        }
      ],
      structuredData: {
        type: 'Article',
        articleBody: post.content,
        headline: post.title,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.date).toISOString(),
      }
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.date).toISOString(),
      description: post.summary,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostLayout content={mainContent} authorDetails={authorDetails}>
          <div className="prose max-w-none">
            {post.content}
          </div>
        </PostLayout>
      </>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    return notFound()
  }
}
