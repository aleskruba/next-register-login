"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import CreateClassComponent from '../components/CreateClassComponent';

const Dashboard = () => {

  const router = useRouter()
  const {session,currentUser,setCurrentUser} = useUserContext()
  const [isLoading,setIsLoading] = useState(true)

  

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
   {/*      <DataTableDemo/> */}
      <div className='flex flex-col py-8 '>
           <div className='italic font-bold'> CREATE A CLASS </div>

            <CreateClassComponent/>

      </div>

        </> : 
        <>
        ... wait please
        </>}
    </div>
  )
}

export default Dashboard