import { TeachersArray, ClassProps } from '@/types';
import { createClass, fetchTeachers } from '@/utils';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";

const CreateClassComponent = () => {
  const router = useRouter()

  const [teachers, setTeachers] = useState<TeachersArray>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setselectedValue] = useState<string>(''); // Initialize with an empty string
  const [languageValue, setLanguageValue] = useState<string | null | undefined>(''); 
  const [classCodeError, setClassCodeError] = useState<string | null>(null);
  const [newClass, setNewClass] = useState<ClassProps>({
    id:'',
    classCode: '',
    language: '',
    schedule: '',
    teacherID: '',
    studentClassesIds: [],
    studentClasses: [],
    teacherClassesIds: [],
    teacherClasses: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTeachers();
        setTeachers(response);


        // Set the initial selectedValue value after fetching teachers
        if (response && response.length > 0) {
          setselectedValue(response[0].l_name);
          setNewClass({
            ...newClass,
            teacherID: response[0].id,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); 

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setselectedValue(e.target.value);

    const selectedTeacher = teachers?.find((teacher) => teacher.id === e.target.value);

    if (selectedTeacher) {
      const languageValue = selectedTeacher.languages ?? ''; // Provide a default value if undefined
      setLanguageValue(languageValue);
  
      setNewClass({ ...newClass, teacherID: e.target.value, language: languageValue });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Check if the input is "classCode" and validate the format
    if (name === 'classCode') {
      const classCodeRegex = /^[0-9][A-Z]$/;
  
      if (value.trim() === '' ) {
        // If the input is empty, clear the error
        setClassCodeError('Input cannot be empty');
      } else if (!classCodeRegex.test(value)) {
        // If the input doesn't match the expected format, set an error message
        setClassCodeError('Class code should be in the format of a number followed by a capital letter (e.g., 1A, 2B).');
      } else {
        // If the input is valid, clear the error
        setClassCodeError(null);
      }
    }
  
    // Update the newClass state
    setNewClass({ ...newClass, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!classCodeError) {
    try { 
  
        const response = await createClass(newClass)

   
        if (response.message === 'success') { 
          console.log(response.message)
          toast.success('Class created  successfully');
          router.push('/')
         
        }
        else {
          alert('Class has not been created ')
          setIsLoading(false);
        }
    
    } 
    catch(e) 
        {console.log(e);}

  } else {
    alert('ERROR')
  }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col max-w-[350px]'>
      <div >

        
        {teachers ? <> 
  
          <select
  name='teacherID'
  value={selectedValue || ""}
  onChange={handleChangeSelect}
  className="text-xl italic mt-2 block w-full pl-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  required>

  <option value="" hidden>Select a teacher</option>

  {teachers?.map((teacher) => (
    <option
      className='text-xl italic'
      value={teacher.id}
      key={teacher.email}
    >
      {teacher.l_name}
    </option>
  ))}
</select>

      {languageValue &&
      <input  disabled    required className='text-xl w-full border border-solid border-gray-500 mt-2 pl-2 py-2'  name='language' placeholder='language'  value={languageValue}  />
   
      }
   
      <input       required className='text-xl w-full border border-solid border-gray-500 mt-2 pl-2 py-2' name='classCode' placeholder='class code' onChange={handleChange} />
          <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>
    
      <input       required className='text-xl w-full border border-solid border-gray-500 mt-2 pl-2 py-2'  name='schedule' placeholder='schedule' onChange={handleChange} />

      </> : <>  </>}

{!isLoading && teachers?
<>
      <input type='submit' 
             value='save' 
             className='bg-blue-500 text-white w-full py-2 mt-2 border border-solid border-gray-500 hover:bg-blue-700 hover:text-white'
             />
             <div className='bg-gray-500 text-white text-center w-full py-2 mt-2 border border-solid border-gray-500  hover:bg-gray-700 hover:text-white'>
            <Link href='../'
                 >
            back 
            </Link>
            </div>
            </>
            :<>      
      
                 
                 </>
  }
      </div>
    </form>
  );
};

export default CreateClassComponent;
