'use client'

import { useState } from 'react'
import { getPublishedPosts, type BlogPost } from '../utils/firebase'
import type { DocumentSnapshot } from 'firebase/firestore'

export default function LoadMorePosts({ 
  initialPosts, 
  onLoadMore 
}: { 
  initialPosts: BlogPost[],
  onLoadMore: (newPosts: BlogPost[]) => void 
}) {
  const [loading, setLoading] = useState(false)
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const { posts, lastVisible: newLastVisible, hasMore: newHasMore } = 
        await getPublishedPosts(lastVisible)
      
      setLastVisible(newLastVisible)
      setHasMore(newHasMore)
      onLoadMore(posts)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasMore) return null

  return (
    <button
      onClick={loadMore}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? 'Loading...' : 'Load More Posts'}
    </button>
  )
}