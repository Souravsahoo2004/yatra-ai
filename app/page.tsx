import Image from "next/image";
import { Button } from "@/components/ui/button"
import Hero from "./_components/Hero";
import { PopularcityList } from "./_components/PopularcityList";

export default function Home() {
  return (
   <>
   <Hero />
   <PopularcityList/>
   </>
        
   
  );
}
