"use client"

import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import Navbar from '../components/Navbar';
import StudentsComponents from '../components/StudentsComponents';

const Students = () => {
    const {session,currentUser} = useUserContext()
    const [isLoading,setIsLoading] = useState(true)
    const router = useRouter()

  useEffect(() => {
    if (session && currentUser?.role === "Admin") {
    setIsLoading(false)
    }
    else {
      router.replace("/");
    }
  },[])


  return (
     <div className='w-screen mt-20 ml-5'>
    {!isLoading ? <>      
      <Navbar/>
      <div className=''> 
      
      <StudentsComponents/>
      </div>

        </> : 
        <>
        ... wait please
        </>}
    </div>
  )
}

export default Students