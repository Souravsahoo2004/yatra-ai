'use client';
import React, { useEffect, useState, useContext } from 'react'
import Header from '@/app/_components/Header'
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import YatraFooter from './_components/yatrafooter';
import { ThemeProvider } from "next-themes";

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const CreateUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>();
  const { user } = useUser();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    if (user) {
      // save new user if not exist
      const result = await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user?.imageUrl,
        name: user?.fullName ?? ''
      });
      setUserDetail(result);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <UserDetailsContext.Provider value={{ userDetail, setUserDetail }}>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
          <Header />
          {children}
         
        </div>
      </UserDetailsContext.Provider>
    </ThemeProvider>
  );
}

export default Provider;

export const useUserDetails = () => {
  return useContext(UserDetailsContext);
};
