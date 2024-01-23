// Classes.tsx
import { ClassArray, StudentsProps } from '@/types';
import { fetchClasses, fetchStudents } from '@/utils';
import React, { useEffect, useState } from 'react';

function Classes() {
  const [classes, setClasses] = useState<ClassArray>();
  const [students, setStudents] = useState<StudentsProps[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [droppedStudents, setDroppedStudents] = useState<{ [classCode: string]: StudentsProps[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await fetchClasses();
        const studentsResponse = await fetchStudents();

        setClasses(classesResponse);
        setStudents(studentsResponse);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  
  function handleDragStart(e: React.DragEvent, student: StudentsProps) {
    e.dataTransfer.setData('text/plain', student.email);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent, classCode: string) {
    e.preventDefault();
    const studentEmail = e.dataTransfer.getData('text/plain');
    const draggedStudent = students?.find((student) => student.email === studentEmail);
  
    if (draggedStudent) {
      setDroppedStudents((prev) => {
        const updatedDroppedStudents = { ...prev };
  
        if (!updatedDroppedStudents[classCode]) {
          updatedDroppedStudents[classCode] = [];
        }
  
        const isStudentAlreadyDropped = updatedDroppedStudents[classCode].some(
          (student) => student.id === draggedStudent.id
        );
  
        if (!isStudentAlreadyDropped) {
          updatedDroppedStudents[classCode] = [...updatedDroppedStudents[classCode], draggedStudent];
  
          setClasses((prevClasses) => {
            const updatedClasses = prevClasses?.map((cl) => {
              if (cl.classCode === classCode) {
                const studentClassesIds = Array.isArray(cl.studentClassesIds) ? [...cl.studentClassesIds] : [];
                
                // Check if the student's id is already in the array
                const isStudentIdAlreadyAdded = studentClassesIds.includes(draggedStudent.id);
                
                if (!isStudentIdAlreadyAdded) {
                  studentClassesIds.push(draggedStudent.id);
                }
  
                return {
                  ...cl,
                  studentClassesIds,
                };
              }
              return cl;
            });
  
            return updatedClasses;
          });
  
          setStudents((prevStudents) =>
            prevStudents?.filter((student) => student.email !== studentEmail)
          );
        }
  
        return updatedDroppedStudents;
      });
    }
  }
  
  
  
console.log(classes)
  return (
    <div className='flex justify-around w-full'>
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

    <div className='max-h-[450px] overflow-y-auto'>
      {classes?.map((cl) => (
        <div
          key={cl.classCode}
          className="relative border border-solid border-black min-h-[120px] min-w-[200px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, cl.classCode)}
        >
          {/* Background content */}
          <div className="absolute bg-yellow-500 opacity-70 text-xl w-full h-full flex flex-col items-center">
            <p>{cl.classCode}-{cl.language}</p>
            <p className='text-xs'>{cl.schedule}</p>
            <div>
              {cl.teacherClasses?.map((teacher) => (
                <div key={teacher.id}>
                  <p>{teacher.f_name} {teacher.l_name}</p>
                </div>
              ))}
            </div>
            {/* Display dropped students here */}
            {droppedStudents[cl.classCode] && (
              <div className="bg-green-200 w-full absolute ">
                  <ul>
                  {droppedStudents[cl.classCode].map((student) => (
                    <li key={student.id} className='w-full text-center '>{student.f_name} {student.l_name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    </div>
  );
}

export default Classes;
