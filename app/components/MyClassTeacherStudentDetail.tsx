import { StudentsProps,GradeProps } from '@/types'
import { fetchStudent } from '@/utils'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'

export type NewGrade = {
    comment?: string;
    value: string;
    StudentID:string
};
export const MyClassTeacherStudentDetail = ({id}:any) => {

    const router = useRouter()
    const [student,setStudent] = useState<StudentsProps>()
    const [isLoading,setIsLoading] = useState(true)
    const [newGrade, setNewGrade] = useState<NewGrade>({
        comment: '',
        value: '',
        StudentID:''
    });
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchStudent(id);
                setStudent(response);
                setIsLoading(false)

            } catch (e) {
                console.error('Error fetching student data:', e);
            }
        };
    
        fetchData();
    }, [id]);


  
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(newGrade)
}

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGrade({
      ...newGrade,
      [e.target.name]: e.target.value,
      StudentID: student?.id || ''  // Update with the student ID if available
    });
  };
  

return (
    <div className='mt-8'>
        {isLoading ? <> wait please ...</> : <>
        <div className='flex flex-col w-[380px] md:w-[580px]'>
        <div className=''>
        <span className='font-bold'>{student?.l_name} {student?.f_name} </span>  
        </div>
        <div>
        {student?.email} 
        </div>
        <div className='mt-8'>
        grades {student?.gradeses.map(grade=>{
            return (
                <div>{grade?.comment} {grade?.value}</div>
            )
        })}
        </div>
        </div>

        <div className='mt-8'>
  <h1 className='text-2xl font-semibold mb-4'>Add a New Grade</h1>
  <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
    <label htmlFor="value" className='text-lg font-medium'>
      New Grade
    </label>
    <input
      type="text"
      id='value'
      name='value'
      onChange={handleChange}
      className='w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    />
    <label htmlFor="comment" className='text-lg font-medium'>
      New Comment
    </label>
    <input
      type="text"
      id='comment'
      name='comment'
      onChange={handleChange}
      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    />
    <input
      type="submit"
      value='Submit'
      className='bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition duration-300'
    />
    <div
      className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition duration-300 flex justify-center'
      onClick={()=>   router.back()}
    >Back </div>
  </form>
</div>

        </>}
        
   
    </div>
  )
}
