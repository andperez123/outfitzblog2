import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPublishedPosts, type BlogPost } from '../../utils/firebase'
import { genPageMetadata } from 'app/seo'
import { Blog } from 'contentlayer/generated'
import type { CoreContent } from '../../utils/CoreContent'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

// Function to transform BlogPost to CoreContent<Blog>
function transformPost(post: BlogPost): CoreContent<Blog> {
  return {
    ...post,
    path: `/blog/${post.slug}`,
    type: 'Blog',
    readingTime: { text: '5 min', minutes: 5, time: 300000, words: 1000 },
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
      datePublished: post.date.toISOString(),
      dateModified: post.date.toISOString(),
    }
  }
}

export default async function BlogPage() {
  const { posts } = await getPublishedPosts()
  const transformedPosts = posts.map(transformPost)
  
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(transformedPosts.length / POSTS_PER_PAGE),
  }

  const initialPosts = transformedPosts.slice(0, POSTS_PER_PAGE)

  return (
    <ListLayout
      posts={transformedPosts}
      initialDisplayPosts={initialPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
