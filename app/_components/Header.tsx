'use client';
import React from 'react'
import Image from 'next/image'
import path from 'path'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs';


const menuOption = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "pricing",
            path: "/pricing",
        },
        {
            name: "about",
            path: "/about",
        },
        {
            name: "contact",
            path: "/contact",
        },

    ]



function Header() {
    const {user} = useUser();

    return (

        <div className='flex justify-between items-center p-4'>
            {/* logo */}
            <div className='flex items-center gap-2'>
                <Image src={'/assets/Logo.svg'} alt='logo' width={30} height={30} />
                <h2 className='font-bold text-2xl' >Yatra AI</h2>
            </div>
            {/* men u */}
            <div className='flex items-center gap-8'>
                {menuOption.map((menu, index) => (
                    <Link href={menu.path}>
                        <h2
                            className='text-lg 
                        hover:scale-105 
                        transition-all 
                        hover:text-purple-700'>{menu.name}</h2>
                    </Link>
                ))}
            </div>
            {/* get started button*/}
            <div>
             {!user ? <SignInButton mode='modal'>
                <Button variant={"outline"} className=
                    'bg-purple-700 shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:transition-all '>Get Started</Button>
                 </SignInButton>:
                 <Link href={'/create-new-trip'}>
                 <Button variant={"outline"} className=
                    'bg-purple-700 shadow-md hover:shadow-purple-500/50 hover:shadow-lg hover:bg-white hover:transition-all ' >Crete New Trip</Button>
             
             </Link>
             
             }
            </div>
        </div>
    )
}
export default Header
