'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';
import { UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const menuOption = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
  { name: "View My Trip", path: "/viewtrip" },
  { name: "About Us", path: "/About" },
  { name: "Blog", path: "/blog" },
];

function Header() {
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex justify-between items-center
        p-4 bg-white/90 dark:bg-gray-900/90
        backdrop-blur-md shadow-md
        transition-colors
      "
    >
      {/* Logo */}
      <div className='flex items-center gap-2'>
        <Image src={'/assets/Logo.svg'} alt='logo' width={30} height={30} />
        <h2 className='font-bold text-2xl dark:text-white'>Yatra AI</h2>
      </div>

      {/* Menu */}
      <nav className='flex items-center gap-8'>
        {menuOption.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className='text-lg hover:scale-105 transition-all hover:text-purple-700 dark:hover:text-purple-400 dark:text-white'>
              {menu.name}
            </h2>
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div className='flex items-center gap-4'>
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-800" />
          )}
        </button>

        {!isSignedIn ? (
          <>
            <SignInButton mode='modal'>
              <Button
                variant="outline"
                className='bg-purple-700 text-white shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:text-purple-700 transition-all'
              >
                Get Started
              </Button>
            </SignInButton>
            <SignInButton mode='modal'>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <UserCircle className="h-8 w-8 text-gray-600 dark:text-white" />
              </button>
            </SignInButton>
          </>
        ) : (
          <>
            <Link href={'/create-new-trip'}>
              <Button
                variant="outline"
                className='bg-purple-700 text-white shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:text-purple-700 transition-all'
              >
                Create New Trip
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: { avatarBox: "h-10 w-10" },
              }}
              afterSignOutUrl="/"
            />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
