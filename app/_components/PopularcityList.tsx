"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from 'next/image';




export function PopularcityList() {
  const cards = data.map((card, index) => (
    <Card 
    
    key={card.src} card={card} index={index}
        
    />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
      Popular Cities to Explore🤩
      </h2>
      <Carousel items={cards}
      
      />
    </div>
  );
}





// components/DestinationContents.tsx

export const ParisContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Paris – The City of Love and Lights.
        </span>{" "}
        Wander through the charming streets of Montmartre, admire the
        Eiffel Tower sparkling at night, and enjoy delicious French
        pastries in cozy cafés. Paris is a city where romance, history,
        and culture meet at every corner.
      </p>
      <img
        src="/assets/paris.jpg"
        alt="Paris - Eiffel Tower"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export const TokyoContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Tokyo – Where Tradition Meets Technology.
        </span>{" "}
        From neon-lit skyscrapers in Shibuya to peaceful shrines in
        Asakusa, Tokyo offers the perfect balance of modern life and
        ancient culture. Try sushi at Tsukiji Market and witness cherry
        blossoms in spring.
      </p>
      <img
        src="/assets/tokiyo.jpg"
        alt="Tokyo City View"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export const CairoContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Cairo – The Gateway to Ancient Wonders.
        </span>{" "}
        Explore the Great Pyramids of Giza, cruise the Nile River, and
        get lost in the bustling Khan El Khalili market. Cairo is a city
        where ancient history comes alive in every stone and artifact.
      </p>
      <img
        src="/assets/egypt.jpg"
        alt="Cairo - Pyramids"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export const BarcelonaContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Barcelona – A City of Art, Sun, and Flavor.
        </span>{" "}
        Admire Gaudí’s masterpieces like Sagrada Familia, stroll down
        La Rambla, and relax by the Mediterranean beaches. Barcelona is
        full of vibrant culture, delicious tapas, and stunning
        architecture.
      </p>
      <img
        src="/assets/barselona.jpg"
        alt="Barcelona - Sagrada Familia"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export const NewYorkContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          New York City – The City That Never Sleeps.
        </span>{" "}
        From Times Square to Central Park, NYC offers endless
        experiences. Visit Broadway shows, enjoy skyline views from the
        Empire State Building, and taste diverse cuisines from around
        the world.
      </p>
      <img
        src="/assets/newyork.jpg"
        alt="New York City Skyline"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export const BaliContent = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Bali – The Island of Gods and Sunsets.
        </span>{" "}
        Relax on golden beaches, explore lush rice terraces, and visit
        stunning temples like Uluwatu. Bali is perfect for both
        adventure seekers and those looking for peace and relaxation.
      </p>
      <img
        src="/assets/indonesia.jpg"
        alt="Bali Beach Sunset"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};




const data = [
  {
    category: "Paris, France",
    title: "Fall in Love Again - Discover the Magic of Paris!",
    src: "/assets/paris.jpg",
    content: <ParisContent />,
  },
  {
    category: "Tokyo, Japan",
    title: "Experience the Future - Your Tokyo Adventure Awaits",
    src: "/assets/tokiyo.jpg",
    content: <TokyoContent />,
  },
  {
    category: "Cairo, Egypt",
    title: "Walk Through Time -Explore the Ancient Wonders of Cairo.",
    src: "/assets/egypt.jpg",
    content: <CairoContent />,
  },
  {
    category: "Barcelona, Spain",
    title: "Sun, Art & Tapas - Your Barcelona Escape Starts Here!",
    src: "/assets/barselona.jpg",
    content: <BarcelonaContent/>,
  },
  {
    category: "New York City, USA",
    title: "The City That Never Sleeps - Plan Your NYC Getaway Now!",
    src: "/assets/newyork.jpg",
    content: < NewYorkContent/>,
  },
  {
    category: "Bali, Indonesia",
    title: "Chase Sunsets - Relax & Reconnect in Beautiful Bali!",
    src: "/assets/indonesia.jpg",
    content: <BaliContent />,
  },
];

