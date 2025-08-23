'use client';
import React, { use } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { AirplayIcon, ArrowDown, Globe2, HotelIcon, ListOrderedIcon, Send } from 'lucide-react'
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


export const suggestionions = [
    {
        title: "Create New Trip",
        icons: <Globe2 className='text-blue-400 h-5 w-5' />,
    },
    {
        title: "Book Hotels",
        icons: <HotelIcon className='text-orange-400 h-5 w-5' />,
    },
    {
        title: "Trvel Guide",
        icons: <AirplayIcon className='text-black-400 h-5 w-5' />,
    },
    {
        title: "List out Your Trip",
        icons: <ListOrderedIcon className='text-green-400 h-5 w-5' />,
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
        // navigate to create trip plan website

        router.push('/create-new-trip');
    }



    return (
        <div className="mt-24 flex flex-col items-center justify-center space-y-8 px-4">
            {/* content */}
            <div className="max-w-3xl w-full text-center space-y-6">
                <h1 className="text-xl md:text-5xl font-bold">
                    Hey, I'm Your Personal <span className="text-purple-700">Trip Planner</span>
                </h1>
                <p className="text-lg">
                    Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip Planning – all in seconds!
                </p>
            </div>

            {/* input-box */}
         
                <div className="border rounded-2xl p-4 shadow-lg relative w-full max-w-xl">
                    <Textarea
                        placeholder="Create Plan Your Trip From Anywhere!"
                        className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
                    />
                    <Button
                        size={'icon'}
                        className="absolute bottom-6 right-6 bg-purple-700 text-white hover:bg-white hover:text-purple-700 shadow-md hover:shadow-purple-500/90 transition-all"
                        onClick={() => onSend()}
                    >
                        <Send className=' h-4 w-4' />
                    </Button>
                </div>
           
            {/* suggestion */}
            <div className='flex gap-5'>
                {suggestionions.map((suggestion, index) => (
                    <div key={index} className='flex items-center gap-2 border rounded-full p-2  cursor-pointer hover:bg-purple-700 hover:text-white' >
                        {suggestion.icons}
                        <h2 className='text-xs'>{suggestion.title}</h2>
                    </div>
                ))}

            </div>

            {/* video section */}


            <h2 className='my-7 mt-14 flex gap-2 text-center'>Not Sure where to Start ? <strong>See How its Works!</strong><ArrowDown /></h2>
            <HeroVideoDialog
                className="block dark:hidden"
                animationStyle="from-center"
                videoSrc="assets/thumbnailvedio.mp4"
                thumbnailSrc="/assets/yt thumbnail.png"
                thumbnailAlt="Dummy Video Thumbnail"
            />


        </div>
    );
}


export default Hero;
