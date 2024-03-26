"use client"
import { fetchCurrentUser } from '@/utils';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { UserProps } from '@/types';
import axios from 'axios';
import { useBeforeUnload } from "react-use";

type UserContextProviderProps = {
    children: React.ReactNode;
};


type UserContext = {
    currentUser: UserProps;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserProps>>;
    session?: any;    
}




export const AuthContext = createContext<UserContext | null>(null);
if (typeof window !== "undefined") {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

      if (key === "theme") {
        localStorage.removeItem(key);
      }
}
}
export default function UserContextProvider({
    children,
}: UserContextProviderProps) {


     const { data: session }: any = useSession();
     const [currentUser, setCurrentUser] = useState<UserProps>(null)
    

     useEffect(() => {
         const fetchData = async () => {
             if (session) {
                 try {
                     const res = await fetchCurrentUser(session.user.email);
              
                   
                     setCurrentUser(res);
             
             
                    } catch (error) {
                     // Handle error if needed
                     console.error("Error fetching current user:", error);
                 }
             }
         };
 
         fetchData();
     }, [session]);




    return (
        <AuthContext.Provider value={{ currentUser,
                                       setCurrentUser,
                                       session}
                                }>
                {children}
        </AuthContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            'useUserContext must be used within a LanguageContextProvider'
        );
    }
    return context;
}