// Students.tsx
import { fetchStudents } from '@/utils';
import React, { useEffect, useState } from 'react';
import { StudentsArray, StudentsProps } from '@/types';

function Students() {
  const [students, setStudents] = useState<StudentsArray>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStudents();
        setStudents(response);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleDragStart(e: React.DragEvent, student: StudentsProps) {
    e.dataTransfer.setData('text/plain', student.email);
  }

  return (
    <div className='flex flex-col text-base'>
      {!isLoading ? (
        <>
          {students?.map((student) => (
            <div
              key={student.email}
              className='flex gap-5'
              draggable
              onDragStart={(e) => handleDragStart(e, student)}
            >
              <div>{student?.f_name}</div>
              <div>{student?.l_name}</div>
            </div>
          ))}
        </>
      ) : (
        <>
          ...students are loading
        </>
      )}
    </div>
  );
}

export default Students;
