import React, { useMemo, useEffect } from 'react';
import DonationButton from './DonationButton';
import WithdrawButton from './WithdrawButton';
import { useAuth } from '../utils/AuthContext';

const PostCard = ({ post, refreshPosts, nullifierHash, proof, onWithdrawSuccess }) => {
  const { user } = useAuth();
  const isOwner = user?.nullifier_hash === post.nullifier_hash;

  const resolvedImage = useMemo(() => {
    if (post.content?.image?.length) {
      return URL.createObjectURL(new Blob([new Uint8Array(post.content.image[0])], { type: "image/*" }));
    }
    return '';
  }, [post]);

  useEffect(() => {
    return () => { if (resolvedImage) URL.revokeObjectURL(resolvedImage); }
  }, [resolvedImage]);

  if (!post) return null;
  const timestamp = new Date(post.timestamp);

  return (
    <div className="
      bg-white/50 dark:bg-gray-900/80 
      backdrop-blur-md 
      rounded-2xl border 
      border-blue-100 dark:border-purple-800 
      shadow-lg hover:shadow-xl 
      hover:scale-[1.02] transition-all duration-300
      p-6 space-y-4 max-w-xl mx-auto
    ">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-blue-600 dark:text-purple-400">
          @{post.handle}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timestamp.toLocaleString()}
        </span>
      </div>

      {post.content?.text && (
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {post.content.text}
        </p>
      )}

      {resolvedImage && (
        <img 
          src={resolvedImage} 
          alt="Post" 
          className="rounded-xl w-full border border-blue-100 dark:border-purple-800 shadow"
        />
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
          💰 {post.content?.donation ?? 0}
        </div>
        
        <div className="flex space-x-2">
          <DonationButton postId={post.id} refreshPosts={refreshPosts} />
          {isOwner && (
            <WithdrawButton 
              postId={post.id}
              nullifierHash={nullifierHash}
              proof={proof}
              refreshPosts={refreshPosts}
              onWithdrawSuccess={onWithdrawSuccess}
              amount={post.content?.donation ?? 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
