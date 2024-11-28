import { db } from '../firebase/clientApp';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  where,
  DocumentSnapshot,
  QueryDocumentSnapshot 
} from 'firebase/firestore';

// Types
export interface BlogPost {
  id: string;
  title: string;
  date: Date;
  tags: string[];
  draft: boolean;
  summary: string;
  content: string;
  slug: string;
  author: string;
}

export interface FirestorePost {
  title: string;
  date: Timestamp;
  tags: string[];
  draft: boolean;
  summary: string;
  content: string;
  slug: string;
  author: string;
}

export interface PublishedPostsResult {
  posts: BlogPost[];
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
}

// Constants
const POSTS_PER_PAGE = 5;

// Functions
export const createBlogPost = async (postData: BlogPost) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      date: Timestamp.fromDate(postData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const getPublishedPosts = async (
  lastVisible?: DocumentSnapshot | null,
  perPage: number = POSTS_PER_PAGE
): Promise<PublishedPostsResult> => {
  try {
    let q = query(
      collection(db, 'posts'),
      where('draft', '==', false),
      orderBy('date', 'desc'),
      limit(perPage)
    );

    if (lastVisible) {
      q = query(
        collection(db, 'posts'),
        where('draft', '==', false),
        orderBy('date', 'desc'),
        startAfter(lastVisible),
        limit(perPage)
      );
    }

    const querySnapshot = await getDocs(q);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    const posts = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as FirestorePost;
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      };
    });

    return {
      posts,
      lastVisible: lastVisibleDoc,
      hasMore: querySnapshot.docs.length === perPage
    };
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

// ... rest of your firebase utility functions