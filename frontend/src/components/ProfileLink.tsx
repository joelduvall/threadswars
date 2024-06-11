import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProfileLink({username='',}) {
  return (
    <Link href={`/@${username}`} className='inline bg-transparent  '>
        <div className='profile-img-container'>
            <Image src="/threads-logo-white-01.png" alt="Joel Duvall" width={36} height={36} className='profile-img' />
        </div>
    </Link>
  )
}
