import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { backend } from '../utils/agent';

const PostForm = ({ refreshPosts }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage('Post cannot be empty.');
      return;
    }
    if (!user?.nullifier_hash || !user?.proof) {
      setMessage('⚠️ Please sign in to post.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      let imageBytes = null;
      if (image) {
        const buffer = await image.arrayBuffer();
        imageBytes = Array.from(new Uint8Array(buffer));
      }

      const serializedProof = JSON.stringify(user.proof);
      const result = await backend.create_post(
        user.handle,
        text,
        imageBytes ? [imageBytes] : [],
        user.nullifier_hash,
        serializedProof
      );

      if ('Ok' in result) {
        setMessage('✅ Post created!');
        setText('');
        setImage(null);
        refreshPosts?.();
      } else {
        setMessage(`❌ ${result.Err}`);
      }
    } catch (err) {
      console.error('Create post failed:', err);
      setMessage('❌ Failed to create post.');
    }
    setLoading(false);
  };

  return (
    <div className="
      max-w-xl mx-auto p-6 
      bg-white/50 dark:bg-gray-900/80 
      backdrop-blur-md 
      border border-blue-100 dark:border-purple-800 
      rounded-2xl shadow-lg
      ring-1 ring-inset ring-blue-50 dark:ring-purple-900/30
      space-y-5
      transition-colors duration-300
    ">
      <h2 className="text-xl font-bold text-blue-700 dark:text-purple-400 text-center">
        Create a Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="
            w-full p-3 rounded-xl border 
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 
            focus:ring-blue-400 dark:focus:ring-purple-600
            transition
          "
          disabled={loading}
          required
        />
        <label className="
          block w-full p-3 rounded-xl border border-dashed 
          bg-gray-100 dark:bg-gray-700 
          text-gray-600 dark:text-gray-300 
          text-center cursor-pointer 
          hover:bg-blue-50 dark:hover:bg-purple-900/30 
          transition
        ">
          {image ? image.name : "📷 Click to upload an image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-2 rounded-xl 
            bg-gradient-to-r from-blue-600 to-purple-500 
            hover:from-blue-700 hover:to-purple-600 
            text-white font-semibold 
            transition disabled:opacity-50
          "
        >
          {loading ? 'Posting...' : 'Submit'}
        </button>
      </form>
      {message && (
        <p className="text-center text-sm text-gray-800 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default PostForm;
