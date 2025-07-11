import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useAuth } from '../utils/AuthContext';
import { backend } from '../utils/agent';
import Balance from '../components/Balance';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [balanceRefresh, setBalanceRefresh] = useState(0);

  const loadPosts = async () => {
    try {
      const result = await backend.get_posts();
      const formatted = result.map(post => ({
        ...post,
        timestamp: Number(post.timestamp),
        content: {
          ...post.content,
          donation: Number(post.content.donation),
        }
      }));
      setPosts(formatted);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br from-blue-50 to-blue-100 
      dark:from-black dark:to-gray-900 
      transition-colors duration-500
      p-6 space-y-10
      pt-20
    ">
      <div className="
        flex justify-between items-center 
        max-w-xl mx-auto 
        bg-white/50 dark:bg-gray-800/50 
        backdrop-blur-md 
        border border-blue-100 dark:border-purple-800 
        rounded-2xl shadow-lg p-4
        transition
      ">
        <h2 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-purple-400">
          ✏️ Create a Post
        </h2>
        <Balance refreshSignal={balanceRefresh} />
      </div>

      <PostForm 
        refreshPosts={() => {
          loadPosts();
          setBalanceRefresh(c => c + 1);
        }} 
      />

      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="
          text-3xl font-bold text-center 
          text-blue-700 dark:text-purple-400 
          relative
        ">
          Latest Posts
          <span className="
            block mx-auto mt-1 w-24 h-1 
            bg-blue-400 dark:bg-purple-600 
            rounded-full
          "></span>
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300 mt-6">
            No posts yet. Be the first to share your message!
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                nullifierHash={user?.nullifier_hash}
                proof={user?.proof}
                refreshPosts={loadPosts}
                onWithdrawSuccess={() => setBalanceRefresh(c => c + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
