import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPublishedPosts } from '../../../../utils/firebase'
import { notFound } from 'next/navigation'
import { CoreContent } from '../../../../utils/CoreContent'
import { Blog } from 'contentlayer/generated'

const POSTS_PER_PAGE = 5

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

export default async function BlogPage({ params }: { params: { page: string } }) {
  const pageNumber = parseInt(params.page)
  const { posts } = await getPublishedPosts()
  const postsList = posts.map(post => ({
    ...post,
    date: post.date.toISOString(),
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
  })) as CoreContent<Blog>[]
  
  const totalPages = Math.ceil(postsList.length / POSTS_PER_PAGE)

  if (pageNumber > totalPages) {
    notFound()
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = postsList.slice(startIndex, endIndex)

  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <ListLayout
      posts={postsList}
      initialDisplayPosts={currentPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
