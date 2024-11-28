'use client'

import { useState } from 'react'
import { createBlogPost } from '../../../utils/firebase'

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    slug: '',
    draft: true,
    author: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const post = {
        ...formData,
        date: new Date(),
        tags: formData.tags.split(',').map(tag => tag.trim()),
      }
      
      await createBlogPost(post)
      alert('Post created successfully!')
      // Reset form
      setFormData({
        title: '',
        summary: '',
        content: '',
        tags: '',
        slug: '',
        draft: true,
        author: ''
      })
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            rows={10}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900 bg-white"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="draft"
            checked={formData.draft}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Draft</label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}

export default CreatePost