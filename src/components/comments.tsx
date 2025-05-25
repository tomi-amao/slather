"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Reply, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  replies: Comment[];
}

interface CommentsProps {
  sandwichId: string;
}

export function Comments({ sandwichId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/comments?sandwichId=${sandwichId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [sandwichId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
          sandwichId,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
        toast.success("Comment added!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!session) {
      toast.error("Please sign in to reply");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          sandwichId,
          parentId,
        }),
      });

      if (response.ok) {
        const reply = await response.json();
        
        // Add reply to the parent comment
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        ));
        
        setReplyContent("");
        setReplyingTo(null);
        toast.success("Reply added!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-4 ${isReply ? 'ml-8 border-l-2 border-[#eccebf]' : 'border border-[#f1ece9]'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#eccebf] flex-shrink-0">
          {comment.user.image ? (
            <Image
              src={comment.user.image}
              alt={comment.user.name || "User"}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8c6a5a] text-sm font-medium">
              {comment.user.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-[#191310]">
              {comment.user.name || "Anonymous"}
            </h4>
            <span className="text-xs text-[#8c6a5a]">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-[#191310] text-sm leading-relaxed mb-3">
            {comment.content}
          </p>
          
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-xs text-[#8c6a5a] hover:text-[#191310] transition-colors"
            >
              <Reply size={12} />
              Reply
            </button>
          )}
          
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-[#f1ece9]"
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitReply(comment.id);
              }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 text-sm border border-[#f1ece9] rounded-lg focus:outline-none focus:border-[#eccebf]"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="px-3 py-2 bg-[#eccebf] text-[#191310] rounded-lg hover:bg-[#d4b896] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f1ece9]">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-[#8c6a5a]" />
        <h2 className="text-xl font-bold text-[#191310]">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#eccebf] flex-shrink-0">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "You"}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8c6a5a] text-sm font-medium">
                  {session.user?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this sandwich..."
                rows={3}
                className="w-full px-3 py-2 border border-[#f1ece9] rounded-lg focus:outline-none focus:border-[#eccebf] resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#8c6a5a]">
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-[#eccebf] text-[#191310] rounded-lg hover:bg-[#d4b896] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={14} />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-[#faf7f5] rounded-lg text-center">
          <p className="text-[#8c6a5a]">Please sign in to join the conversation</p>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-[#eccebf] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#8c6a5a] mt-2">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle size={48} className="text-[#eccebf] mx-auto mb-3" />
          <p className="text-[#8c6a5a]">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}