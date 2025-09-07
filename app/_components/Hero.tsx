'use client';
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { AirplayIcon, ArrowDown, Globe2, HotelIcon, ListOrderedIcon, Send } from 'lucide-react'
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const suggestionions = [
    {
        title: "Create New Trip",
        icons: <Globe2 className='text-blue-500 h-5 w-5' />,
    },
    {
        title: "Book Hotels",
        icons: <HotelIcon className='text-orange-500 h-5 w-5' />,
    },
    {
        title: "Travel Guide",
        icons: <AirplayIcon className='text-gray-700 dark:text-gray-300 h-5 w-5' />,
    },
    {
        title: "List out Your Trip",
        icons: <ListOrderedIcon className='text-green-500 h-5 w-5' />,
    },
]

function Hero() {
    const { user } = useUser();
    const router = useRouter();

    const onSend = () => {
        if (!user) {
            router.push('/sign-in');
            return;
        }
        router.push('/create-new-trip');
    }

    return (
        <div className="mt-24 flex flex-col items-center justify-center space-y-8 px-4">
            {/* content */}
            <div className="max-w-3xl w-full text-center space-y-6">
                <h1 className="text-xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                    Hey, I'm Your Personal <span className="text-purple-700 dark:text-purple-400">Trip Planner</span>
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip Planning – all in seconds!
                </p>
            </div>

            {/* input-box */}
            <div className="border rounded-2xl p-4 shadow-lg relative w-full max-w-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <Textarea
                    placeholder="Create Plan Your Trip From Anywhere!"
                    className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <Button
                    size={'icon'}
                    className="absolute bottom-6 right-6 bg-purple-700 text-white hover:bg-white hover:text-purple-700 dark:hover:bg-gray-700 dark:hover:text-purple-300 shadow-md hover:shadow-purple-500/90 transition-all"
                    onClick={onSend}
                    suppressHydrationWarning={true}
                >
                    <Send className='h-4 w-4' />
                </Button>
            </div>

            {/* suggestion */}
            <div className='flex flex-wrap gap-3 md:gap-5 justify-center'>
                {suggestionions.map((suggestion, index) => (
                    <div
                        key={index}
                        className='flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 cursor-pointer 
                                   text-gray-700 dark:text-gray-200 
                                   hover:bg-purple-700 hover:text-white transition'
                    >
                        {suggestion.icons}
                        <h2 className='text-xs md:text-sm'>{suggestion.title}</h2>
                    </div>
                ))}
            </div>

            {/* video section */}
            <h2 className='my-7 mt-14 flex gap-2 text-center text-gray-800 dark:text-gray-200'>
                Not Sure where to Start ? <strong className="text-gray-900 dark:text-white">See How it Works!</strong>
                <ArrowDown className="h-5 w-5" />
            </h2>
            <HeroVideoDialog
                className="block"
                animationStyle="from-center"
                videoSrc="/assets/Demo-For-AI-Trip2.mp4"
                thumbnailSrc="/assets/yt thumbnail.png"
                thumbnailAlt="Dummy Video Thumbnail"
            />
        </div>
    );
}

export default Hero;
