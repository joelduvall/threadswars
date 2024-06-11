import React from 'react'
import Image from 'next/image'
import { HeartIcon, HomeIcon, MenuIcon, SearchIcon, SquarePenIcon, UserRoundIcon } from 'lucide-react'
import Link from 'next/link'
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
export default function Header() {
  return (
    <div className='flex flex-1 justify-between px-6 mx-auto min-w-40 max-w-5xl'>
      
      <div>
        <Image src="/threads-logo-white.svg" alt="Logo" width={26} height={26}   />
      </div>
      <div className='hidden md:flex justify-center space-x-4 flex-grow'>

        <Link href="/" className='icon hidden md:flex'>
          <HomeIcon size={26} color='white'  />            
        </Link>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href="/" className='icon hidden md:flex pointer-events-none' aria-disabled tabIndex={-1} >
                <SearchIcon size={26} color='gray' />            
              </Link>
            </TooltipTrigger>
            <TooltipContent className='px-1.5 py-1 text-white bg-transparent opacity-75'>
              <p>Search Feature Coming Soon ..</p>
            </TooltipContent>
          </Tooltip>
        
          <Tooltip>
            <TooltipTrigger>
              <Link href="/"  className='icon hidden md:flex pointer-events-none' aria-disabled tabIndex={-1}>
                <SquarePenIcon size={26} color='gray' />            
              </Link>
            </TooltipTrigger>
            <TooltipContent className='px-1.5 py-1 text-white bg-transparent opacity-75'>
              <p>Writing Feature Coming Soon ..</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="/" className='icon hidden md:flex pointer-events-none' aria-disabled tabIndex={-1}>
                <HeartIcon size={26} color='gray' />            
              </Link>
            </TooltipTrigger>
            <TooltipContent className='px-1.5 py-1 text-white bg-transparent opacity-75'>
              <p>Activity Feature Coming Soon ..</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="/" className='icon hidden md:flex pointer-events-none' aria-disabled tabIndex={-1}>
                <UserRoundIcon size={26} color='gray' />            
              </Link>
            </TooltipTrigger>
            <TooltipContent className='px-1.5 py-1 text-white bg-transparent opacity-75'>
              <p>Profile Feature Coming Soon ..</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
      <div>
      <SignedOut>
        <SignInButton >
            <div className="signin-button">
              <div className="pl-4 pr-4 overflow-x-hidden overflow-y-hidden overflow-ellipsis justify-center text-black font" >Sign In</div>
            </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton></UserButton>
        {/* <Link href="/" className='icon'>
          <MenuIcon size={26} color='white' />                          
        </Link>
        <SignOutButton></SignOutButton> */}
      </SignedIn>
        
      </div>

    </div>
  )
}
