'use client';
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';
import { UserCircle } from "lucide-react"; // nice fallback icon

const menuOption = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
  { name: "View My Trip", path: "/viewtrip" },
  { name: "About Us", path: "/About" },
  { name: "Blog", path: "/blog" },
];

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className='flex justify-between items-center p-4'>
      {/* Logo */}
      <div className='flex items-center gap-2'>
        <Image src={'/assets/Logo.svg'} alt='logo' width={30} height={30} />
        <h2 className='font-bold text-2xl'>Yatra AI</h2>
      </div>

      {/* Menu */}
      <div className='flex items-center gap-8'>
        {menuOption.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className='text-lg hover:scale-105 transition-all hover:text-purple-700'>
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Right section (Button + Profile) */}
      <div className='flex items-center gap-4'>
        {!isSignedIn ? (
          <>
            {/* Get Started if not logged in */}
            <SignInButton mode='modal'>
              <Button
                variant="outline"
                className='bg-purple-700 text-white shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:text-purple-700 transition-all'
              >
                Get Started
              </Button>
            </SignInButton>

            {/* Profile icon (triggers sign-in) */}
            <SignInButton mode='modal'>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <UserCircle className="h-8 w-8 text-gray-600" />
              </button>
            </SignInButton>
          </>
        ) : (
          <>
            {/* Create trip button when logged in */}
            <Link href={'/create-new-trip'}>
              <Button
                variant="outline"
                className='bg-purple-700 text-white shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:text-purple-700 transition-all'
              >
                Create New Trip
              </Button>
            </Link>

            {/* User profile avatar with dropdown (Clerk UserButton handles sign-out) */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
