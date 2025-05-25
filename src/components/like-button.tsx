"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface LikeButtonProps {
  sandwichId: string;
  className?: string;
}

export function LikeButton({ sandwichId, className = "" }: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial like status and count
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/likes?sandwichId=${sandwichId}`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.userHasLiked);
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [sandwichId]);

  const handleLike = async () => {
    if (!session) {
      toast.error("Please sign in to like sandwiches");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sandwichId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        
        if (data.liked) {
          toast.success("Liked!");
        } else {
          toast.success("Unliked!");
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update like");
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        liked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} ${className}`}
    >
      <Heart
        size={18}
        className={`transition-all duration-200 ${
          liked ? "fill-current text-red-600" : ""
        }`}
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
}