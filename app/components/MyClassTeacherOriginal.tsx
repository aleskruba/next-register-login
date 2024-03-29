"use client"
import React,{useState,useEffect } from 'react'
import { fetchClasses, fetchMyProfileTeacher} from "@/utils";
import {  ClassArray,  TeachersProps } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function MyClassTeacher({id}:any) {



    const [teacher,setTeacher] = useState<TeachersProps>()
    const [classes, setClasses] = useState<ClassArray>([]);
    const [isLoading,setIsLoading] = useState(true)

    const router = useRouter()



    useEffect(() =>{
      const fetchData = async () => { 
        const response = await fetchMyProfileTeacher(id)
        const allClasses = await fetchClasses();   
        
              
        setTeacher(response)
        setClasses(allClasses);
        setIsLoading(false)

        
    }
    fetchData()
        },[]);


      const teacherClasses = classes.filter((cl: { teacherClassesIds: string | string[]; }) => cl.teacherClassesIds?.includes(teacher?.id || "")).map((cl: { classCode: any; }) => cl.classCode);
  
  return (
    <div className="mt-10 flex justify-center ">
      
    {!isLoading ? <>  
   
    <div className=" px-2 py-2 min-w-[380px] md:min-w-[480px]  flex flex-col items-start border border-solid border-1 text-xl ">

        <div className='flex '>
            {classes?.map((cl)=>{
                if (cl.classCode === teacherClasses[0] )
                
                return(
                <div key={cl.id}>    
                  <div className='flex flex-col px-2 py-2 text-gray-100 bg-gray-500' >
                    <div className='flex justify-between min-w-[380px] md:min-w-[480px] '>
                    <div>CLASS CODE:</div> <div> {cl.classCode}</div>
                    </div> 
                    <div className='flex justify-between min-w-[380px] md:min-w-[480px] '>
                    <div>LANGUAGE :</div> <div>  {cl.language}</div>
                    </div>
                    <div className='flex justify-between min-w-[380px] md:min-w-[480px] '>
                    <div>SCHEDULE :</div> <div>{cl.schedule}</div>
                    </div>
                </div>
                    <div className='mt-5'>
                        {cl.studentClasses.map(student=>{
                            return (
                                <Link href={`/myclass/${id}/${student.id}`} key={student.id}>
                                    <div className='flex  px-2  text-gray-900 bg-gray-100 justify-between min-w-[380px] md:min-w-[480px]' >
                                   
                                        <div className=' hover:font-bold overflow-hidden'>
                                            {student.l_name.length + student.f_name.length > 15
                                            ? `${student.l_name} ${student.f_name}`.slice(0, 15) + '...'
                                            : `${student.l_name} ${student.f_name}`}
                                            </div>

                                            <div className='flex'>      
                                               <span>total grades:</span>  <span className='pl-4'>   
                                               {student.gradesIds.length}
                                                                             </span>

                                            </div>
                                    </div>  
                                </Link>
                            )
                        })}
                    </div>

                </div>
                )
            })}

        </div>


    </div>
    </>
    :<>
    <div className='w-screen h-screen flex justify-center items-center'>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
    </>
    }
   </div>
  )
}

export default MyClassTeacher