import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  limit,
  Timestamp,
  orderBy,
  QueryDocumentSnapshot,
  startAfter,
  limit as firestoreLimit
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export type BlogPost = {
  id: string
  title: string
  date: Date
  slug: string
  tags: string[]
  draft: boolean
  summary: string
  content: string
  author: string
}

export type NewBlogPost = Omit<BlogPost, 'id'>

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(
      postsRef,
      where('slug', '==', slug),
      limit(1)
    )

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()
    
    return {
      id: doc.id,
      title: data.title,
      date: data.date.toDate(),
      slug: data.slug,
      tags: data.tags || [],
      draft: data.draft,
      summary: data.summary,
      content: data.content,
      author: data.author
    }
  } catch (error) {
    console.error('Error getting post by slug:', error)
    throw error
  }
}

export const createBlogPost = async (postData: NewBlogPost) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      date: Timestamp.fromDate(postData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw error
  }
}

export type PostsResponse = {
  posts: BlogPost[]
  lastVisible: QueryDocumentSnapshot | null
  hasMore: boolean
}

export const getPublishedPosts = async (
  lastVisible?: QueryDocumentSnapshot,
  limit: number = 10
): Promise<PostsResponse> => {
  try {
    const postsRef = collection(db, 'posts')
    let q = query(
      postsRef,
      where('draft', '==', false),
      orderBy('date', 'desc'),
      firestoreLimit(limit + 1)  // Get one extra to check if there are more
    )

    if (lastVisible) {
      q = query(q, startAfter(lastVisible))
    }

    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs

    // Check if there are more posts
    const hasMore = docs.length > limit
    const postsToReturn = hasMore ? docs.slice(0, -1) : docs // Remove the extra document if there are more

    const posts = postsToReturn.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        date: data.date.toDate(),
        slug: data.slug,
        tags: data.tags || [],
        draft: data.draft,
        summary: data.summary,
        content: data.content,
        author: data.author
      } as BlogPost
    })

    return { 
      posts,
      lastVisible: docs.length > 0 ? docs[docs.length - 1] : null,
      hasMore
    }
  } catch (error) {
    console.error('Error getting published posts:', error)
    throw error
  }
}

// ... rest of your firebase utility functions