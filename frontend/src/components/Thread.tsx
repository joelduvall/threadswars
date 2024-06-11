import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { currentUser } from '@clerk/nextjs/server'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { IThread } from '@/models/Thread'
import { getUserDisplayName } from '@/models/user'
import ThreadTools from './ThreadTools'
import { formatTimeElapsed } from '@/lib/utils'

export async function ThreadCore( { thread }: {thread: IThread})  {

  //Get Current User information for clerk
  const user = await currentUser();
  const  userId = user?.externalId; //externalId is the Thread Wars User Id from its data store

  return (
    <div className='thread-grid'>
      <div className="threaderer-cell" > {/* Row 1,2 col1 */}
        <Avatar className='h-9 w-9'>
          <AvatarImage src={ thread.user?.avatar } alt={ thread.user?.username} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>              
      </div>
      <div className='threaderer-name-cell'> {/* Row 1 col2 */}
        <div className="threader-info">
          <div className="flex gap-1.5 col-start-1 self-center items-baseline">
            <span className="flex items-center flex-row">
              <div>
                {/* Profile Name */}
                  <Link href={"/"} className="inline m-0 p-0 border-0 border-none bg-transparent touch-manipulation box-border">
                    <span className="overflow-visible max-w-full text-foreground font-semibold text-left break-words">
                      { getUserDisplayName(thread.user) }
                    </span>
                  </Link>
              </div>
              <span className="mt-px ml-1">
                {/* Status icon -> Future Feature for verfied users*/}
              </span>
            </span>
            <span>
              {/* Time since thread created */}
              <div className='inline p-0 m-0 decoration-0 bg-transparent border-0 touch-manipulation border-none box-border '>
                <time className="inline-block min-w-6 whitespace-nowrap text-center cursor-pointer text-secondary-foreground">
                  <span className="p-0 m-0 decor no-underline decoration-inherit  decoration-0 whitespace-nowrap">
                    { thread.createdAt && formatTimeElapsed(new Date(thread.createdAt))}
                  </span>
                </time>
              </div>
            </span>
          </div>
        </div>            
      </div>
      <div className='thread-link-indicators-cell'> {/* Row 3,4 col1 */}
          {/* thread connectors to replies */}
          <div style={{ 'height':'100%', 'width':'100%', 'position':'relative', 'display':'block', 'paddingTop':'10px', 'paddingBottom':'0', 'boxSizing':'border-box' }}>
          { thread.replies?.length > 0 &&
              <div className='block absolute top-2.5 bottom-0' style={{ 'left':'calc(50% - 1px)'}}>
                <div className='thread-connector block absolute  w-0.5 h-full rounded-sm' style= {{ 'backgroundColor': 'rgb(51, 54, 56)'}}></div>
              </div>
          }
          </div>
      </div>
      <div className='thread-content-cell'> {/* Row 2,3,4 col2 */}
          <div> {/* thread content area plus footer */}
            <div className='thread-text-content'>
                <span className=''> {/* thread content */}
                  { thread.content }
                </span>
            </div>
            { thread.media.length > 0 &&
            <div className='block mt-2 z-0'> {/* thread media */} 
                <div className='thread-media-container z-0'>
                {
                  thread.media.map((media) => (
                    <div key={media.url}  className='thread-image-container z-0' style={{ '--maxHeight': '430px', '--aspectRatio': media.width / media.height } as React.CSSProperties}>
                      <picture className='select-none z-0'>
                        <Image  src={media.url} width={media.width} height={media.height} alt="Logo" className=' z-0 rounded-lg outline outline-1 -outline-offset-1 outline-border' /> 
                      </picture>
                    </div>
                  ))
                }
                </div> 
            </div>
            }
            <div className='-ml-2 mt-2'> {/* thread tool */} 
                <ThreadTools thread={thread} userId={userId}></ThreadTools>
            </div>
          </div>
      </div>
    </div>
  )
}

export default function Thread( { thread }: {thread: IThread }) {
  return (
    <div className='thread-package-flex-filler'>
      <div className='thread-container'> 
        <div className={ (( thread.replies === undefined || thread.replies?.length == 0) && ( thread.parentThread === undefined || thread.parentThread === null)) ? "lead-thread-wrapper lead-thread-wrapper-no-reply": "lead-thread-wrapper" }    >
          <ThreadCore thread={thread} />         
        </div>
      </div>
      {/* replies */}
      {thread.replies?.map((reply) => (
      <div key={reply._id} className="thread-container">
        <div className="reply-thread-wrapper">
          <ThreadCore thread={reply} />        
        </div>
      </div>
      ))}     
    </div>
  )
}
