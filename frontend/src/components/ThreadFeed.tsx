import { IThread } from '@/models/Thread'
import React from 'react'
import Thread from './Thread'

export default function ThreadFeed({ threads} : { threads: IThread[] }) {
  return (
    <div className='thread-package'>        
      {
          threads?.map((thread) => (
              <Thread key={thread._id} thread={thread} />
          ))
      }
    </div>
  )
}