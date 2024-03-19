import React,{ useEffect, useState} from 'react'
import { fetchClassesTeacher } from '@/utils';
import { ClassArray } from '@/types';
import Link from 'next/link';


function ChooseChatBox() {


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
    <div className=''>{classes.length > 1 && <> Choose Chat Box </> }</div>

    <div className='flex gap-4 mt-4 flex-col md:flex-row lg:flex-row '>
        
     {classes?.map(cl => {

        return (
            <Link  key={cl.id} href={`chatrooms/${cl.id}`} >
            <div  className='relative group'>
                <div className='flex flex-col items-center justify-center w-[150px] h-[150px] bg-white rounded-lg shadow-md transition duration-300 transform hover:shadow-lg'>
                    <div className='text-2xl text-black'>Chat room</div>
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
    <div className=' h-screen flex justify-center '>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
    </> }

    </div>


  )
}

export default ChooseChatBox