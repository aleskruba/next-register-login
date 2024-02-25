"use client"
import Navbar from "@/app/components/Navbar";
import { useRouter } from 'next/navigation'
import { StudentsProps, ClassArray} from "@/types";
import { deleteStudent, fetchClasses, fetchStudent, updateStudent } from "@/utils";
import toast from "react-hot-toast";
import { FC,useEffect,useState,ChangeEvent,FormEvent } from "react";

interface Props {
     params: 
     { id: string }
}
    

 
const Post: FC<Props> = ({params}) => {

  const router = useRouter()

    const [updateSelected,setUpdateSelected] = useState(false)  
    const [student,setStudent] = useState<StudentsProps>()
    const [classes, setClasses] = useState<ClassArray>([]);
    const [isLoading,setIsLoading] = useState(true)
    const [classCodeError, setClassCodeError] = useState<string | null>(null);

    const [updatedStudent, setUpdatedStudent] = useState<StudentsProps>({
      id: '',
      email: '',
      f_name: '',
      l_name: '',
      role: '', 
        });

    useEffect(() =>{
   
        const fetchData = async () => { 
        const response = await fetchStudent(params.id)
        const allClasses = await fetchClasses();
    console.log(response)
        setStudent(response)
        setClasses(allClasses);
        setIsLoading(false)
        }
        fetchData()
    },[]);

    const studentClasses = classes
    .filter((cl) => cl.studentClassesIds?.includes(student?.id || ""))
    .map((cl) => cl.classCode);

    
    const handleEditClick = (ID:any) => {
      console.log(ID)
      setUpdateSelected(true)

      setUpdatedStudent({
        id: student?.id || '',       
        email: student?.email || '', 
        f_name: student?.f_name || '', 
        l_name: student?.l_name || '', 
        role: student?.role || '',  
      });

    }


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
  
      setUpdatedStudent({ ...updatedStudent, [name]: value });

    };

    const handleDelete = (ID:any) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this student?");

        if (isConfirmed) {
          console.log(ID);
      try{
        setIsLoading(true)
        const fetchData = async () => {
          const response = await deleteStudent(ID)
     
          if (response.message === 'unauthorized'){
            setClassCodeError('Class must be empty.');
          console.log('unauthorized')
          setIsLoading(false)  
        }

          toast.success('Class created  successfully');
          router.push('/students')
          setIsLoading(false)  
        }
        fetchData()
 
      }catch(err){
        console.log(err)
   
      }
    }

    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); 
      console.log(updatedStudent);

      try{
        const fetchFunc = async () => {
        const response = await updateStudent(updatedStudent) 
        console.log(response)
        if (response.message = 'success') {
          toast.success('Updated successfully');
          router.push('/students')
        }
        }
        fetchFunc()

      } catch(err){
        console.log(err)
        toast.error('Student has not bee Updated  successfully');
      }
    
    }
  useEffect(() => {

  },[updatedStudent.role])

    return (    
    <div className="mt-20 flex justify-center ">
      
        <Navbar />
        {!isLoading ? <>  
        <div className="mt-20 px-5 py-5 min-w-[380px] md:min-w-[480px] text-gray-900 flex flex-col items-start border border-solid border-1 text-xl bg-gray-100">
   
        {!updateSelected ? <>
   
          <div className="flex justify-between w-full ">
            <div>email : </div> <div>{student?.email}</div>
          </div>
          <div className="flex justify-between w-full">
           <div>name: </div><div>{student?.f_name}</div>
          </div>
          <div className="flex justify-between w-full">
            <div>last name:</div><div>{student?.l_name}</div>
            </div>
    {/*         <div className="flex justify-between w-full">
             <div>role: </div><div>{student?.role}</div>
           </div> */}
                <div className="flex justify-between w-full">
            <div>class:</div><div> {studentClasses.join(", ")}</div>
          </div>
          <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>

          {!isLoading &&
          <div className="px-5 mt-4 flex justify-between w-full">

          <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded "
               onClick={()=>handleEditClick(student?.id)}> 
             update 
          </button>
          <button   className={`${
                           studentClasses.length > 0
                            ? 'bg-red-200 text-gray-200 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                        } w-[150px] flex justify-center items-center  rounded px-8 py-2`}
                        disabled={  studentClasses &&  studentClasses.length > 0}
                        onClick={()=>handleDelete(student?.id)}
                        >
            delete
             </button>
      
          </div>}

         { studentClasses.length > 0 &&
          <span className="text-xs text-red-400 text-end w-full">Only students without class can be deleted  </span>
         }

      </> : <>
      <form onSubmit={handleSubmit} className="w-full">
      <div className="flex justify-between w-full ">
    
            <div>email : </div> <input type="email" value={updatedStudent?.email} className="bg-gray-200" name="email" onChange={handleChange}/>
          </div>
          <div className="flex justify-between w-full mt-1">
           <div>name: </div><input type="text" value={updatedStudent?.f_name} className="bg-gray-200" name="f_name"  onChange={handleChange}/>
          </div>
          <div className="flex justify-between w-full mt-1">
            <div>last name:</div><input type="text" value={updatedStudent?.l_name} className="bg-gray-200" name="l_name" onChange={handleChange}/>

            </div>

       {/*      <div className="flex justify-between w-full mt-1">
              <div className="flex items-center">role:</div>
              <label className="flex items-center">
                <input
                          disabled={  studentClasses &&  studentClasses.length > 0}
                  type="radio"
                  value="Student"
                  checked={updatedStudent?.role === 'Student'}
                  onChange={handleChange}
                  className="bg-gray-200 border-none rounded-md p-2 cursor-pointer"
                  name="role"
                />
                <span className="ml-2">Student</span>
              </label>
              <label className="flex items-center">
                <input
                          disabled={  studentClasses &&  studentClasses.length > 0}
                  type="radio"
                  value="Teacher"
                  checked={updatedStudent?.role === 'Teacher'}
                  onChange={handleChange}
                  className="bg-gray-200 border-none rounded-md p-2 cursor-pointer"
                  name="role"
                />
                <span className="ml-2">Teacher</span>
              </label>

            </div>
            {studentClasses &&  studentClasses.length > 0 &&
            <span className="text-xs text-red-400 text-end w-full">Change of role works only if Class is empty  </span>}
 */}

                <div className="flex justify-between w-full mt-1">
            <div>class:</div><div> {studentClasses.join(", ")}</div>
          </div>
          <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>
          {!isLoading &&
          <div className="px-5 mt-4 flex justify-between w-full">

          <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white " type="submit">
              
             save 
          </button>
          <button         className="px-8 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white "            onClick={()=>{setUpdateSelected(false)}}
                        >
            cancel
             </button>
          </div>}
          </form>
           </>
      
      }
          </div>


        </>
        :<>
                ... wait please
        </>
        }
       </div>

  )
}
 
export default Post;