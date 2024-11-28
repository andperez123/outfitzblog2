import Main from './Main'
import { getPublishedPosts } from '../utils/firebase'

export default async function Page() {
  const { posts } = await getPublishedPosts()
  return <Main posts={posts} />
}
