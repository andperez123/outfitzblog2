export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'> & {
  path: string
  type: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  filePath: string
  structuredData: {
    type: string
    articleBody: string
    headline: string
    datePublished: string
    dateModified: string
  }
}
