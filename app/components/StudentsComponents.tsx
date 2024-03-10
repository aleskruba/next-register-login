import { StudentsArray, ClassArray } from '@/types';
import { fetchClasses, fetchStudents } from '@/utils';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes"

const StudentsComponents = () => {
  const [classes, setClasses] = useState<ClassArray>([]);
  const [students, setStudents] = useState<StudentsArray>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const allStudents = await fetchStudents();
      const allClasses = await fetchClasses();

      setStudents(allStudents);
      setClasses(allClasses);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.l_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
 <div className='mt-4 '>
    
 

    {!isLoading ? <>   

      <input
        type="text"
        className='text-base px-4 py-2 border border-solid border-gray-300'
        placeholder="Search by last name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> 
      {filteredStudents .sort((a, b) => a.l_name.localeCompare(b.l_name)).map((student) => {
        const studentClasses = classes
          .filter((cl) => cl.studentClassesIds?.includes(student.id))
          .map((cl) => cl.classCode);

        return (
          <div key={student.id} className='mt-2 text-base border border-solid border-gray-300 max-w-[360px] md:max-w-[580px]'>
            <div className='cursor-pointer w-[200px] flex justify-between'>
              <Link href={`/students/${student.id}`}>
                <div className={`min-w-[360px] md:min-w-[580px] w-full flex justify-between px-1 py-1 ${resolvedTheme === 'dark' ? 'hover:bg-gray-300 hover:text-black' : 'hover:bg-gray-500 hover:text-white '} `}>
                    <div className='flex justify-between w-[320px]'>
                    <div className=' overflow-hidden'>
                        {student.l_name.length + student.f_name.length > 15
                          ? `${student.l_name} ${student.f_name}`.slice(0, 15) + '...'
                          : `${student.l_name} ${student.f_name}`}
                      </div>

                      <div className='overflow-hidden'>
                        {student.email.length > 15
                          ? `${student.email.slice(0, 15)}...`
                          : student.email}
                      </div>

                    </div>
                   <div className='font-bold min-w-[25px] '>
                    {studentClasses}
                    </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}


      </>:<>
      <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
      </>}  
    </div>
  );
};

export default StudentsComponents;
