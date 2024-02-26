import { TeachersArray, ClassArray } from '@/types';
import { fetchClasses, fetchTeachers } from '@/utils';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes"

function TeachersComponents() {

    const [classes, setClasses] = useState<ClassArray>([]);
    const [teachers, setTeachers] = useState<TeachersArray>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { resolvedTheme } = useTheme();
  
    
  useEffect(() => {
    const fetchData = async () => {
      const allStudents = await fetchTeachers();
      const allClasses = await fetchClasses();

      setTeachers(allStudents);
      setClasses(allClasses);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.l_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className='mt-4 '>
       
         <input
           type="text"
           className='text-base px-4 py-2 border border-solid border-gray-300'
           placeholder="Search by last name"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
   
   {!isLoading ? <>   
     
         {filteredTeachers .sort((a, b) => a.l_name.localeCompare(b.l_name)).map((teacher) => {
           const teacherClasses = classes
             .filter((cl) => cl.teacherClassesIds?.includes(teacher.id))
             .map((cl) => cl.classCode);
             const classCodesString = teacherClasses.join(',');
           return (
             <div key={teacher.id} className='mt-2 text-base border border-solid border-gray-300 max-w-[390px] md:max-w-[580px]'>
               <div className='cursor-pointer w-[200px] flex justify-between'>
                 <Link href={`/teachers/${teacher.id}`}>
                   <div className={`min-w-[390px] md:min-w-[580px] w-full flex justify-between px-1 py-1 ${resolvedTheme === 'dark' ? 'hover:bg-gray-300 hover:text-black' : 'hover:bg-gray-500 hover:text-white '} `}>
                       <div className='flex justify-between w-[320px]'>
                         <div >
                            {teacher.l_name} {teacher.f_name} 
                         </div>
                         <div > 
                           {teacher.email}  
                         </div>
                       </div>
                      <div className='font-bold min-w-[25px]'>
                       {classCodesString}
                       </div>
                   </div>
                 </Link>
               </div>
             </div>
           );
         })}

</>:<>
        <div>
        wait please ...
        </div>
      </>}  
       </div>
     );
}

export default TeachersComponents