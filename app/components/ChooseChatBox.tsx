import React,{ useEffect, useState} from 'react'
import { useUserContext } from "../../context/auth-context";

import { fetchClassesTeacher } from '@/utils';
import { ClassArray } from '@/types';
import Link from 'next/link';


function ChooseChatBox() {

    const {currentUser} = useUserContext()
    const [isLoading,setIsLoading] = useState(true)
    const [classes,setClasses] = useState<ClassArray>([])


    useEffect(()=>{
        
        const fetchData = async () => {

            const response = await fetchClassesTeacher()
            setClasses(response)
            setIsLoading(false)
        }
        fetchData()

    },[])

  return (
    <div className='flex flex-col justify-between items-center'>
{!isLoading ? <> 
    <div className=''>Choose Chat Box</div>

    <div className='flex gap-4 mt-4'>
        
     {classes?.map(cl => {

        return (
            <Link  key={cl.id} href={`chatrooms/${cl.id}`} >
            <div  className='relative group'>
                <div className='flex items-center justify-center w-[150px] h-[150px] bg-white rounded-lg shadow-md transition duration-300 transform hover:shadow-lg'>
                    <div className='text-2xl text-black'>{cl.classCode}</div>   
                </div>
                <div className='absolute inset-0 bg-black opacity-0 hover:opacity-20 rounded-lg transition-opacity duration-300'></div>
            </div>
            </Link>
        )
     }
     )}
 </div>


    </> : <>
    <div className='w-screen h-screen flex justify-center '>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
    </> }

    </div>


  )
}

export default ChooseChatBox