import Image from "next/image";
import { Button } from "@/components/ui/button"
import Hero from "./_components/Hero";
import { PopularcityList } from "./_components/PopularcityList";
import SelectDaysUi from "./create-new-trip/_components/SelectDaysUi";



export default function Home() {
  return (
   <>
   <Hero />
   <PopularcityList/>
   
   </>
        
   
  );
}
