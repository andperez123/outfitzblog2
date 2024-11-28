'use client'

import { useState } from 'react'
import { getPublishedPosts, PostsResponse, BlogPost } from '../utils/firebase'
import { QueryDocumentSnapshot } from 'firebase/firestore'

type LoadMorePostsProps = {
  initialData: PostsResponse
  onPostsLoaded: (newPosts: BlogPost[]) => void
}

export default function LoadMorePosts({ initialData, onPostsLoaded }: LoadMorePostsProps) {
  const [loading, setLoading] = useState(false)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(initialData.lastVisible)
  const [hasMore, setHasMore] = useState(initialData.hasMore)

  const loadMore = async () => {
    if (!lastVisible || loading || !hasMore) return

    setLoading(true)
    try {
      const data = await getPublishedPosts(lastVisible)
      onPostsLoaded(data.posts)
      setLastVisible(data.lastVisible)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasMore) return null

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={loadMore}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load More Posts'}
      </button>
    </div>
  )
}