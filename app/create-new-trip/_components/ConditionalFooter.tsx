'use client';
import { usePathname } from 'next/navigation';
import Yatrafooterwraper from '@/app/_components/Yatrafooterwraper';

const ConditionalFooter: React.FC = () => {
  const pathname = usePathname();
  
  // ✅ Hide footer specifically on the CreateNewTrip page
  const hideFooterPaths = [
    '/create-trip',
    '/create-new-trip', 
    '/new-trip',
    // Add your actual route path here
  ];
  
  const shouldShowFooter = !hideFooterPaths.some(path => pathname.startsWith(path));
  
  // Don't render footer on specified pages
  if (!shouldShowFooter) {
    return null;
  }
  
  return <Yatrafooterwraper />;
};

export default ConditionalFooter;
