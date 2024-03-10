import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ClassArray,ClassProps,TeacherDetails,TeachersArray } from '@/types';
import { deleteClass, fetchClasses, fetchTeachers, updateClass} from '@/utils';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

function ManageClassesComponents() {

    const router = useRouter();
    const [classes, setClasses] = useState<ClassArray>([]);
    const [teachers, setTeachers] = useState<TeachersArray>([]);
    const [isLoading,setIsLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState<null | string>(null);
    //const [selected, setSelected] = useState<string>('');
    const [classCodeError, setClassCodeError] = useState<string | null>(null);
 

    const [updatedClass, setUpdatedClass] = useState<ClassProps>({
      id:'',
      classCode: '',
      language: '',
      schedule: '',
      teacherID: '',
      studentClassesIds: [] ,
      studentClasses: [],
      teacherClassesIds: [],
      teacherClasses: [],
      });

 
    useEffect(()=>{
    
        const fetchData = async () => {
        const allClasses = await fetchClasses()
        const allTeachers = await fetchTeachers()

        setClasses(allClasses)
        setTeachers(allTeachers)
        setIsLoading(false)
    }
        fetchData();


    },[])

    const handleDelete = async (ID:string) => {

      const isConfirmed = window.confirm("Are you sure you want to delete this class?");

      if (isConfirmed) {
        console.log(ID);

        const classToBeDeleted = classes.find(cl => cl.id === ID)

        if (classToBeDeleted?.studentClassesIds?.length === 0) {
    
            try { 
                const response = await deleteClass(ID)
         
                if (response.message === 'success') {
                    console.log(response.message)
                    setClasses(prevClasses => prevClasses.filter(cl => cl.id !== ID));

                }
                
            } 
            catch(e) 
                {console.log(e);}
    

        }
        else { alert('Class is not empty , cannot be deleted !!!! ')}

      }
            }
  
    const handleEditClick = (ID:string) =>{
        setSelectedClass(ID)
        console.log(ID)
        {classes.forEach( cl =>{
            if (cl.id === ID) {
          

                cl.teacherClassesIds /* && setSelected( cl.teacherClassesIds[0]) */
                setUpdatedClass({
                  id: cl.id,
                  classCode: cl.classCode,
                  language: cl.language,
                  schedule: cl.schedule,
                  teacherID: cl.teacherClasses && cl.teacherClasses[0]?.id,
                  teacherClasses: cl.teacherClasses && [cl.teacherClasses[0]],
                  studentClasses: cl.studentClasses && [cl.studentClasses[0]],
                  teacherClassesIds: cl.teacherClassesIds || [],  // Add this line
                });
                              
            }

         })}
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
  


        if (name === 'classCode') {
          const classCodeRegex = /^[0-9][A-Z]$/;
    
          if (!classCodeRegex.test(value)) {
            setClassCodeError('Class code should be in the format of \n a number followed by a capital letter (e.g., 1A, 2B).');
          } else {
            setClassCodeError(null);
          }
        }
    
        setUpdatedClass({ ...updatedClass, [name]: value });

      };

      const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
     
     /*    setSelected(e.target.value);
        console.log(e.target.value); */
        console.log(teachers)
        const selectedTeacher = teachers.find(teacher => teacher.id === e.target.value) 
        console.log(selectedTeacher)
      
        setUpdatedClass((prevClass:any) => {
          const updatedTeacherClasses = prevClass.teacherClasses || []; 

          const selectedTeacher: TeacherDetails = {
            id: e.target.value, 
          };
      
          return {
            ...prevClass,
            teacherID: e.target.value,
            teacherClasses: [selectedTeacher],
          };
        });
      };
      
      

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        if (!classCodeError) {
        try{

      
          console.log('updatedClass',updatedClass)  
  
          console.log('selectedClass',selectedClass)
          if (selectedClass) {
            const newValue = classes.map(element => {
              if (element.id === selectedClass) {
                // Update the properties of the matching object
                return { ...element, ...updatedClass };
              }
              return element;
            });
            setClasses(newValue);
     
        }

          setSelectedClass(null)

          const response = await updateClass(updatedClass)
         if (response.message === 'success') {
           toast.success('Class updated successfully')
          router.refresh()
          } 

        }
          catch (err) {
            console.log(err);
          }
      
      }
    }

  return (
    <div>
        {!isLoading  ? <>
        <div className='mb-5'>
        <h1>Update or delete a class</h1>
        </div>
        {classes.map( cl =>{

    
            return (
                <div key={cl.id} className='border border-solid border-gray-400 flex justify-between px-2 min-w-[380px]  md:min-w-[500px] '>
                    
                    {selectedClass && selectedClass === cl.id  ? <> 
                        <form onSubmit={handleSubmit} className=' flex justify-between  min-w-[380px]  md:min-w-[500px] '>
             
                        <div className='flex-1 text-base'>
                        <div> <input value={updatedClass.classCode} 
                                     name='classCode'
                                     className='border border-solid border-gray-500'
                                     onChange={handleChange}
                                     />
                            <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>               
                        </div>
                     
                                                <div> <input value={updatedClass.schedule} 
                                     name='schedule'
                                     className='border border-solid border-gray-500'
                                     onChange={handleChange}
                                     />
                        </div>
                        <div> <input value={updatedClass.language} 
                                       name='language'
                                     className='bg-gray-200 text-gray-500'
                                     onChange={handleChange}
                                     disabled
                                     />
                        </div> 
                        <div>      
                          Total Students   {cl.studentClassesIds?.length}
                        </div>
                     </div>
                        <div className='flex-1 '>

                        <div className='flex justify-end items-center flex-col'>
                        <select 
                    name='teacherID' 
                    value={updatedClass?.teacherID} 
                     className="text-base italic mt-2 mb-2 block w-[80%] max-h-[30px] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    onChange={handleChangeSelect}
                  >
                    <option 
                      className='text-base italic'
                      value=''  // Set the value of the default option
                      disabled  // Make it disabled to prevent selection
                    >
                      Choose a Teacher
                    </option>

                    {teachers.map((teacher) => (
                      <option 
                        className='text-base italic'
                        key={teacher.id}
                        value={teacher.id}
                      >
                        {teacher.f_name} {teacher.l_name}
                      </option>
                    ))}
                  </select>
      </div>   
                        <div className='flex justify-end items-center flex-col'>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-[150px] flex justify-center items-center rounded-tl-5 rounded  mb-1'
                            type='submit'
                        >save</button>
                  <button
                        className=' bg-red-500 hover:bg-red-600 text-white cursor-pointer w-[150px] flex justify-center items-center rounded-tl-5 rounded  mb-1'
                        onClick={()=>setSelectedClass(null)}
                        >
                        cancel
                        </button>
                        </div>
                      
                            
                       </div>
                
                    </form>
            
                                    </> :
                     <>  
                    
                    <div className='flex-1 text-base'>
                        <div >{cl.classCode}</div>
                        <div >{cl.language}</div>
                        <div >{cl.schedule}</div>
                        <div >      
                          Total Students   {cl.studentClassesIds?.length}
                        </div>
                     </div>
                        <div className='flex-1'>
                  
                      

                              {cl.teacherClasses?.map((teacher) => 
                        
                     
                        (
                            <div key={teacher.id} className='flex justify-center'>
                 
                           <p className='font-bold  text-xs md:text-base  mt-1 mb-3'>
                            
                            { teachers.map(t => { 
                                if (t.id ===  teacher.id) {
                            
                                  return ` ${t.f_name} ${t.l_name} `
                                }
                            })     }
                            
                            </p>
                  
                            </div>
                        ))}

                       
                      
                        <div className='flex justify-end items-center flex-col'>
                     
                        {!selectedClass ? <> 
                        <button className='bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-[150px] flex justify-center items-center rounded-tl-5 rounded  mb-1'
                        onClick={()=>handleEditClick(cl.id)}
                        >update</button>
                        <button
                        className={`${
                            cl.studentClassesIds &&  cl.studentClassesIds?.length > 0
                            ? 'bg-red-200 text-gray-200 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                        } w-[150px] flex justify-center items-center rounded-tl-5 rounded mb-3`}
                        disabled={  cl.studentClassesIds &&  cl.studentClassesIds?.length > 0}
                        onClick={()=>handleDelete(cl.id)}
                        >
                        delete
                        </button>

                        </> : 
                        <>
                         <button className='bg-blue-200 text-white w-[150px] flex justify-center items-center rounded-tl-5 rounded  mb-1'
                                  disabled={true}  
                        >update</button>
                        <button
                                    className='bg-red-200 text-white w-[150px] flex justify-center items-center rounded-tl-5 rounded  mb-1'
                                    disabled={true}  
                        >
                        delete
                        </button>
             
                        </>}
                        {cl.studentClassesIds &&  cl.studentClassesIds?.length > 0 &&  <span className="text-xs text-red-400 text-end w-full mb-2">Only empty class can be deleted  </span> }
        
                        </div>
                       
                    
                       </div>
                
                
                       </> }
                
                </div>
            )
    
    
    })}
        </> : 
        <>
            <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
        </> 
        }
    </div>
  )
}

export default ManageClassesComponents