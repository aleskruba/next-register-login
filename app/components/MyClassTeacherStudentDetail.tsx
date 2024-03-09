import { StudentsProps,GradeProps, NewGrade, UpdatedGrade } from '@/types'
import { deleteGrade, updateGrade, fetchGrade, fetchStudent } from '@/utils'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import moment from 'moment';
import { AiFillDelete, AiOutlineEdit,AiFillCheckCircle,AiFillCloseCircle   } from 'react-icons/ai';



export const MyClassTeacherStudentDetail = ({id}:any) => {

    const router = useRouter()
    const [student,setStudent] = useState<StudentsProps>()
    //const [classes, setClasses] = useState<ClassArray>([]);
    const [updateSelected,setUpdateSelected] = useState(null)  
    const [isLoading,setIsLoading] = useState(true)
    const [isLoadingSubmit,setIsLoadingSubmit] = useState(false)
    const [isDeletingGrade,setIsDeletingGrade] = useState(false)
    const [newGrade, setNewGrade] = useState<NewGrade>({
        createdAt: new Date(),
        updatedAt:new Date(),
        comment: '',
        value: '',
        StudentID:'',
         });
    const [updated,setUpdated] = useState(false)

    const [updatedGrade, setUpdatedGrade] = useState<UpdatedGrade>({
      gradeID:'',
      comment: '',
      value: '',
      StudentID:'',
      updatedAt:new Date(),
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchStudent(id);
                //const allClasses = await fetchClasses();   
                setStudent(response);
              //  setClasses(allClasses);
                setIsLoading(false)
              console.log(response)
            } catch (e) {
                console.error('Error fetching student data:', e);
            }
        };
    
        fetchData();
    }, [id,updated]);




const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newGrade.value && newGrade.comment ) { 
    setIsLoadingSubmit(true)

    try {
      const updatedStudent = { ...student };

      updatedStudent.gradeses?.push({
        value: newGrade.value,
        comment: newGrade.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '',
        studentGradesIds: [],
        studentGrades: [],
        teacherGradesIds: [],
        teacherGrades: []
      });
    
      // Update the state with the new "gradeses" array
      setStudent(updatedStudent as StudentsProps);
      
      const response = await fetchGrade(newGrade)
      console.log(response)
      if (response === 'success') {
        toast.success('Grade updated successfully')
       

        setNewGrade({comment: '',
                     value: '',
                     StudentID:'',
                     createdAt: new Date(),
                     updatedAt:new Date(),
                   })
        setUpdated(!updated)
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoadingSubmit(false)
      }

      else {
        toast.error('Grade was not updated successfully')
        setIsLoadingSubmit(false)
        }
    }catch (err) {
      console.log(err)
      setIsLoadingSubmit(false)

    } 
  }
  else {toast.error('cannot be empty')}
}

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGrade({
      ...newGrade,
      [e.target.name]: e.target.value,
      StudentID: student?.id || ''  // Update with the student ID if available
    });
  };
  
const deleteGradeFunction = (id:any) =>{


  const isConfirmed = window.confirm("Are you sure you want to delete this student?");

  if (isConfirmed) {
 

  const data = { gradeID:id,
                studentID:student?.id
  }
  setIsDeletingGrade(true);
  try{
    const fetchFunction = async () =>{
      const response =  await deleteGrade(data);
      console.log(response)
      if (response.data === 'success') {
             setUpdated(!updated)
             router.refresh()
             await new Promise(resolve => setTimeout(resolve, 1000));
             setIsDeletingGrade(false) 
      }
    }
    fetchFunction()
  } catch(err) {
    console.log(err)
    setIsDeletingGrade(false)

  }
}
}

const handleEditClick = (ID:any) => {
  console.log(ID)
   setUpdateSelected(ID)

   student?.gradeses.forEach(grade => {
    if (grade.id === ID) {

      setUpdatedGrade({
        gradeID : ID,
        comment: grade.comment || '',
        value: grade.value || '',
        StudentID:student.id || '',
        updatedAt:new Date(),
          });
        }
    })

}

const handleEditChange  = (e: ChangeEvent<HTMLInputElement>) => {

   setUpdatedGrade({
    ...updatedGrade,
    [e.target.name]: e.target.value,
    StudentID: student?.id || ''  // Update with the student ID if available
  }); 

}


const saveEditChange =  async () => {
  const updatedStudent = { ...student };
  console.log(updatedGrade)
  
  try { 
    const response = await updateGrade(updatedGrade)
     if (response.data = 'success') {
        router.refresh()
     }
     else (
      toast.error('Failed to update')

     )

    updatedStudent.gradeses!.forEach((element, index) => {
      if (element.id === updatedGrade.gradeID) {
  
  
        updatedStudent.gradeses![index] = {
          ...element,
          value: updatedGrade.value,
          comment: updatedGrade.comment,
          updatedAt:updatedGrade.updatedAt,
        };
      }
    });
    setStudent(updatedStudent as StudentsProps);
    setUpdateSelected(null);
  
  } catch (err) {
    console.log(err)
  }


};


return (
    <div className='mt-8 px-2'>
        {isLoading ? <>      
          <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
            </> 
          : <>
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

{isLoadingSubmit ? <> 
 
  <input
      type="submit"
      value='Submit'
      className='bg-blue-200 text-white px-4 py-2 rounded-md transition duration-300'
      disabled
 />
    <div
      className='bg-gray-200 text-white px-4 py-2 rounded-md transition duration-300 flex justify-center'
      >Back 
    </div>


      </> : <> 
    <input
      type="submit"
      value='Submit'
      className='bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition duration-300'
    />
    <div
      className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition duration-300 flex justify-center'
      onClick={()=>   router.back()}
    >Back 
    </div>
 </>}
 
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
    <h3 className="font-semibold">Created On</h3>
  </div>

  <div className="col-span-1">
    <h3 className="font-semibold">Updated On</h3>
  </div>

 
     
  </div>
 {student?.gradeses.map(grade => {

   if (!updateSelected) { 
      const formattedCreatedAt = moment(grade.createdAt).format('DD.MM YY');
      const formattedUpdatedAt = moment(grade.updatedAt).format('DD.MM YY');

    return (
 
 
        <div key={grade.id} className={`grid grid-cols-5 gap-4 text-base my-1 border-b border-b-1 ${isDeletingGrade ? 'opacity-50 pointer-events-none' : ''}`}>

         <div className='max-w-[20px]'>
           <p>{grade.value}</p>
         </div>
         <div className='max-w-[250px] ' >
             <p>{grade.comment}</p>
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedCreatedAt}</p>
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedUpdatedAt}</p>
         </div>
         <div className='flex justify-end'>
            <div className='w-[25px] flex justify-center cursor-pointer' onClick={()=>handleEditClick(grade.id)}>
    
            <AiOutlineEdit className="text-xl text-blue-500 hover:text-blue-400" />
          </div>
          <div className='w-[25px] flex justify-center cursor-pointer ' 
              onClick={()=>deleteGradeFunction(grade.id)}>
          <AiFillDelete className="text-xl text-red-500 hover:text-red-400" />
          </div>
         </div>
       </div>
 
    )

    } if (updateSelected && updateSelected === grade.id) {
      const formattedCreatedAt = moment(grade.createdAt).format('DD.MM YY');
      const formattedUpdatedAt = moment(grade.updatedAt).format('DD.MM YY');

    return (
 
 
        <div key={grade.id} className={`grid grid-cols-5 gap-4 text-base my-1 border-b border-b-1 `}>

         <div className='max-w-[60px]  '>
          <input type='text' 
                 name='value' 
                 className=' w-full border border-solid border-black '
                 value={updatedGrade.value}
                 onChange={handleEditChange}
                 />
               
         </div>
         <div className='max-w-[150px]'>
          <input type='text' 
                 name='comment' 
                 className='w-full border border-solid border-black'
                 value={updatedGrade.comment}
                 onChange={handleEditChange}
                 />
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedCreatedAt}</p>
         </div>
         <div className='max-w-[60px]'>
            <p>{formattedUpdatedAt}</p>
         </div>
         <div className='flex justify-end'>
            <div className='w-[25px] flex justify-center cursor-pointer' 
             onClick={()=>{saveEditChange()}}>
    
            <AiFillCheckCircle className="text-xl text-blue-500 hover:text-blue-400" />
          </div>
          <div className='w-[25px] flex justify-center cursor-pointer ' 
             >
          <AiFillCloseCircle className="text-xl text-red-500 hover:text-red-400"
          onClick={()=>{setUpdateSelected(null)}} />
          </div>
         </div>
       </div>
      )
    }
  


  })}

</div>

        </>}
        
   
    </div>
  )
}
