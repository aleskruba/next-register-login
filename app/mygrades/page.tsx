"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";

function MyGrades() {

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
    <div className='mt-20'>

        {!isLoading ? <>      
              <Navbar/>
              <div >
            <h1>My Grades</h1>
            </div>
                </> : 
                <>
          <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
                </>}
            </div>
          )
        }

export default MyGrades