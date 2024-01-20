"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../context/auth-context";
import { useRouter } from "next/navigation";

function Teacher() {

  const router = useRouter()
  const {session,currentUser} = useUserContext()
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          console.log("Current User:", currentUser);
          if (currentUser.role === "Teacher") {
            setIsLoading(false);
          } else {
   
            router.replace("/");

          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [session, currentUser]);

  return (
    <div className='w-full'>

        {!isLoading ? <>      
              <Navbar/>
              Teacher Page

                </> : 
                <>
                ... wait please
                </>}
            </div>
          )
        }

export default Teacher