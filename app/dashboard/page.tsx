"use client"
import { DataTableDemo } from '@/components/TableComponent'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import Students from '../components/StudentsNOTinUSE';
import Class from '../components/Class';

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
   
      <div className=' mt-20'>

        <Class/>
      </div>

        </> : 
        <>
        ... wait please
        </>}
    </div>
  )
}

export default Dashboard