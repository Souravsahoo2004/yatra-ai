'use client';
import React, { useEffect } from 'react'
import Header from '@/app/_components/Header'
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { User } from 'lucide-react';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { useState, useContext } from 'react';
import YatraFooter from './_components/yatrafooter';



function Provider({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const CreateUser = useMutation(api.user.CreateNewUser)
  
  const [userDetail,setUserDetail]=useState<any>();
  
  const { user } = useUser();
  
   useEffect(()=>{
    user && CreateNewUser();
   },[user])


  const CreateNewUser = async () => {
    if (user) { 
 

      // save new user if not exist
      const result = await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress??'',
        imageUrl: user?.imageUrl,
        name: user?.fullName ??''

      }); 
      setUserDetail(result);
    }

  }


  return (
    <UserDetailsContext.Provider value={{userDetail,setUserDetail}}>
    <div>
      <Header />
      {children}
     <YatraFooter/>
    </div>
    </UserDetailsContext.Provider>
  )
}

export default Provider;

export const useUserDetails = () => {
  return useContext(UserDetailsContext);
}


