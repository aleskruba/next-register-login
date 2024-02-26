"use client"

import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import Navbar from '../components/Navbar';
import TeachersComponents from '../components/TeachersComponents';

const Teachers = () => {
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
     <div className='w-screen mt-20 ml-5 '>
    {!isLoading ? <>      
      <Navbar/>
      <div className=''> 
      
      <TeachersComponents/>
      </div>

        </> : 
        <>
        ... wait please
        </>}
    </div>
  )
}

export default Teachers