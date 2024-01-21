"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import Link from 'next/link';

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
    <div className='w-screen'>
    {!isLoading ? <>      
      <Navbar/>
   {/*      <DataTableDemo/> */}
      <div className='flex w-full justify-around'>
            CREATE CLASS
            <Link href='../dashboard'>
            Back to dashboard
            </Link>
      </div>

        </> : 
        <>
        ... wait please
        </>}
    </div>
  )
}

export default Dashboard