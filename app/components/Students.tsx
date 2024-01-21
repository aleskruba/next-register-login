"use client"
import { fetchStudents } from '@/utils'
import React, { useEffect,useState } from 'react'
import { StudentsArray } from '@/types'


function Students() {

    const [students, setStudents] = useState<StudentsArray>()
    const [isLoading, setIsLoading] = useState(true)

    try {

        useEffect(()=>{ 
            const fetchData = async () => {
            const response = await fetchStudents()
            setStudents(response)
            setIsLoading(false)
            }
            fetchData()
        },[])
    }
    catch(err){
        console.log(err)
        setIsLoading(false)
    }

    return (
    <div className='flex flex-col'>
        {!isLoading ? 
        <>       
        {students?.map(student => (
        <div key={student.email} className='flex gap-5'>
            <div>
         {student?.f_name}
            </div>
            <div>
   {student?.l_name}
            </div>
        </div>
        ))}
</>
:<>
...students are loading
</>
}
    </div>
  )
}

export default Students