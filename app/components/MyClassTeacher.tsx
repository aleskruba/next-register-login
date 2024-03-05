"use client"
import React,{useState,useEffect,ChangeEvent,FormEvent } from 'react'
import { fetchClasses, fetchMyProfileTeacher, fetchStudents, updateTeacherProfile} from "@/utils";
import { ClassProps, ClassArray,StudentsArray, StudentsProps, TeachersProps } from '@/types';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import Link from 'next/link';




function MyClassTeacher({id}:any) {



    const router = useRouter()
    const [teacher,setTeacher] = useState<TeachersProps>()
    const [classes, setClasses] = useState<ClassArray>([]);
    const [isLoading,setIsLoading] = useState(true)
    

    useEffect(() =>{
      const fetchData = async () => { 
        const response = await fetchMyProfileTeacher(id)
        const allClasses = await fetchClasses();   
        

        console.log(allClasses)
        
        setTeacher(response)
        setClasses(allClasses);
        setIsLoading(false)

        
    }
    fetchData()
        },[]);


      const teacherClasses = classes.filter((cl: { teacherClassesIds: string | string[]; }) => cl.teacherClassesIds?.includes(teacher?.id || "")).map((cl: { classCode: any; }) => cl.classCode);
        console.log(teacherClasses[0])
 
  return (
    <div className="mt-10 flex justify-center ">
      
    {!isLoading ? <>  
    <div className=" px-2 py-2 min-w-[380px] md:min-w-[480px] text-gray-900 flex flex-col items-start border border-solid border-1 text-xl bg-gray-100">

        <div className='flex '>
            {classes?.map((cl)=>{
                if (cl.classCode === teacherClasses[0] )
                
                return(
                <div key={cl.id}>    
                  <div className='flex flex-col bg-red-200' >
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
                                    <div className='flex  bg-blue-200 justify-between min-w-[380px] md:min-w-[480px]' >
                                        <div>{student.f_name} {student.l_name} </div>

                                            <div className='flex'>      
                                               <span>grades:</span>  <span>   
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
            ... wait please
    </>
    }
   </div>
  )
}

export default MyClassTeacher