import { StudentsProps,GradeProps, NewGrade } from '@/types'
import { fetchGrade, fetchStudent } from '@/utils'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import moment from 'moment';
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';

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
                console.log(response)
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
    try {

      const response = await fetchGrade(newGrade)
      console.log(response)
      if (response === 'success') {
        toast.success('Grade updated successfully')
   /*      if(student) {
          setStudent({...student,gradeses:[...gradeses,newGrade]});
          } */

        setNewGrade({comment: '',
                     value: '',
                     StudentID:''})
      
    router.refresh()
      }

      else {
        toast.error('Grade was not updated successfully')}

    }catch (err) {
      console.log(err)
    }

}

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGrade({
      ...newGrade,
      [e.target.name]: e.target.value,
      StudentID: student?.id || ''  // Update with the student ID if available
    });
  };
  

return (
    <div className='mt-8 px-2'>
        {isLoading ? <> wait please ...</> : <>
        <div className='flex flex-col w-[380px] md:w-[580px]'>
        <div className=''>
        <span className='font-bold'>{student?.l_name} {student?.f_name} </span>  
        </div>
        <div>
        {student?.email} 
        </div>
        </div>

        <div className='mt-4'>
  <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
    <label htmlFor="value" className='text-lg font-medium'>
      New Grade
    </label>
    <input
      type="text"
      id='value'
      value={newGrade.value}
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
      value={newGrade.comment}
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

<div >

  <div className="grid grid-cols-5 gap-4 text-xs  mt-4">
  <div className="col-span-1 ">
    <h3 className="font-semibold">Value</h3>
  </div>

  <div className="col-span-1">
    <h3 className="font-semibold">Comment</h3>
  </div>

  <div className="col-span-1">
    <h3 className="font-semibold">Created At</h3>
  </div>

  <div className="col-span-1">
    <h3 className="font-semibold">Updated At</h3>
  </div>
    
  </div>
 {student?.gradeses.map(grade => {

      const formattedCreatedAt = moment(grade.createdAt).format('YY DD.MM');
      const formattedUpdatedAt = moment(grade.updatedAt).format('YY DD.MM');

    return (
      <div key={grade.id} className="grid grid-cols-5 gap-4 text-base my-1 border-b border-b-1">

 

         <div className='max-w-[20px]'>
           <p>{grade.value}</p>
         </div>
         <div className='max-w-[250px]'>
             <p>{grade.comment}</p>
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedCreatedAt}</p>
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedUpdatedAt}</p>
         </div>
         <div className='flex justify-end'>
            <div className='w-[25px] flex justify-center cursor-pointer '>
            <AiOutlineEdit className="text-xl text-blue-500 hover:text-blue-400" />
          </div>
          <div className='w-[25px] flex justify-center cursor-pointer '>
          <AiFillDelete className="text-xl text-red-500 hover:text-red-400" />
          </div>
         </div>
       </div>
 
    )
  })}

</div>

        </>}
        
   
    </div>
  )
}
