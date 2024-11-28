import { useState } from 'react';
import { createBlogPost, type NewBlogPost } from '../utils/firebase';

export default function BlogPostEditor() {
  const [formData, setFormData] = useState<NewBlogPost>({
    title: '',
    summary: '',
    content: '',
    tags: [],
    slug: '',
    draft: true,
    date: new Date(),
    author: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData: NewBlogPost = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        tags: formData.tags,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        draft: formData.draft,
        date: formData.date,
        author: formData.author
      };

      await createBlogPost(postData);
      alert('Post created successfully!');
      // Reset form
      setFormData({
        title: '',
        summary: '',
        content: '',
        tags: [],
        slug: '',
        draft: true,
        date: new Date(),
        author: ''
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="w-full p-2 border rounded font-mono"
          rows={10}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={formData.tags.join(',')}
          onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
          className="w-full p-2 border rounded"
          placeholder="fashion, style, outfits"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.draft}
          onChange={(e) => setFormData({...formData, draft: e.target.checked})}
          className="mr-2"
        />
        <label className="text-sm font-medium">Save as draft</label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Post
      </button>
    </form>
  );
}