import { StudentsArray, ClassArray } from '@/types';
import { fetchClasses, fetchStudents } from '@/utils';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const StudentsComponents = () => {
  const [classes, setClasses] = useState<ClassArray>([]);
  const [students, setStudents] = useState<StudentsArray>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      {!isLoading ? (
        <>
          {students.map((student) => {
            const studentClasses = classes
              .filter((cl) => cl.studentClassesIds?.includes(student.id))
              .map((cl) => cl.classCode);

            return (
              <div key={student.id} className='mt-2 text-base'>
                <div className='cursor-pointer w-[200px] flex justify-between'>
              <Link href={`/students/${student.id}`}>    {student.l_name} {student.f_name}  -  <span className='font-bold'>{studentClasses}</span></Link>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          ... wait please
        </>
      )}
    </div>
  );
};

export default StudentsComponents;
