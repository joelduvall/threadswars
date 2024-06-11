'use client'

import { cn } from '@/lib/utils'
import { IThread } from '@/models/Thread';
import { useUser } from '@clerk/nextjs';
import { HeartIcon, MessageCircleIcon, Repeat2Icon, SendIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button';

/**
 * 
 * @param param0 
 * @returns 
 */
export default function ThreadTools({thread, userId}: {thread: IThread, userId : string | null | undefined}) {

  const { isLoaded,  user } = useUser();

  const [liked, setLiked] = useState(thread.likes?.includes(userId || '') ?? false);
  const [likes, setLikes] = useState(thread.likes);
  
  const likeThisThread = async () => {
    
    if (!user?.externalId) {
      throw new Error("User not authenticated");
    }

    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body = {
      userId: user.id,
    };

    setLiked(!liked);
    setLikes(newLikes);

    const headers =  {
      "Content-Type": "application/json",
    };
  
    const response = await fetch(
      `/api/threads/${thread._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ ...body }),
      }
    );

    if (!response.ok) {
      setLiked(originalLiked);
      throw new Error("Failed to like post");
    }

    const fetchLikesResponse = await fetch(`/api/threads/${thread._id}/like`);
    if (!fetchLikesResponse.ok) {
      setLikes(originalLikes);
      throw new Error("Failed to fetch likes");
    }

    const newLikesData = await fetchLikesResponse.json();

    setLikes(newLikesData);
  };

  return (
    <div className='flex'>
      <div className='flex -ml-2 w-max justify-center'> {/* like thread */}
        <div className='thread-action-item'>
          <Button
           variant="ghost" size="icon"
            className="thread-tool-button h-8 w-8"
            onClick={likeThisThread}
          >
            <HeartIcon size={18}  className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}/>
          </Button>
        </div>                      
      </div>
      <div className='thread-action-item'> {/* reply thread */}
          <MessageCircleIcon size={18} color='gray' className='hidden md:flex pointer-events-none' aria-disabled tabIndex={-1} />
      </div >
      <div className='thread-action-item'> {/* repost thread */}
          <Repeat2Icon size={18} color='gray'className='hidden md:flex pointer-events-none' aria-disabled tabIndex={-1}/>
      </div>
      <div className='thread-action-item'> {/* share thread */}
          <SendIcon size={18} color='gray' className='hidden md:flex pointer-events-none' aria-disabled tabIndex={-1} />
      </div>
    </div>
  )
}
