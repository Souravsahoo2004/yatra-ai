'use client';
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

function TripPage() {
  const searchParams = useSearchParams();

  const destination = searchParams.get('destination');
  const hotel = searchParams.get('hotel');
  const image = searchParams.get('image');

  // ✅ If no destination → show default placeholder image
  if (!destination) {
    return ( 
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <Image
          src="/assets/viewtripempty.jpg" // static placeholder
          alt="No Trip Planned"
          width={600}
          height={300}
          className="rounded-xl shadow-2xl"
        />
        <h2 className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Start chatting with AI to plan your trip 🚀
        </h2>
      </div>
    );
  }

  // ✅ Show trip details when destination is available
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-8 tracking-tight">
        ✈️ Your Planned Trip
      </h1>

      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:scale-[1.01] transition-transform">
        <div className="relative w-full h-[280px]">
          <Image
            src={image || `https://source.unsplash.com/1600x900/?${destination}`}
            alt={destination}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {destination}
            </h2>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {hotel && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="text-lg font-medium">Stay: {hotel}</p>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 text-red-500" />
            <p className="text-lg">Destination: {destination}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
              Book Hotel
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-xl flex items-center gap-2"
            >
              Explore More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TripPage;