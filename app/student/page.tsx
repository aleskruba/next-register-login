"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import StudentsComponents from '../components/StudentsComponents';

function Student() {

  const router = useRouter()
  const {session,currentUser} = useUserContext()
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          if (currentUser.role === "Student" || "Admin") {
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

                </> : 
                <>
                      <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
                </>}
            </div>
          )
        }

export default Student