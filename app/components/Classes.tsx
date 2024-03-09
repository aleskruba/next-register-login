// Classes.tsx
import { ClassArray, StudentsProps } from '@/types';
import { fetchClasses, fetchStudents, updateStudentsInClass } from '@/utils';
import React, { useEffect, useState } from 'react';
import { IoMdCheckmark} from "react-icons/io"

function Classes() {
  const [classes, setClasses] = useState<ClassArray>([]);
  const [students, setStudents] = useState<StudentsProps[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [droppedStudents, setDroppedStudents] = useState<{ [classCode: string]: StudentsProps[] }>({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [isChahnged, setIsChanged] = useState(false);
  const [originalStudentsLength, setOriginalStudentsLength] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await fetchClasses();
        const studentsResponse = await fetchStudents();
        console.log(studentsResponse);
  
        // Extract all student ids and class codes from classesResponse
        const allStudentInfo = classesResponse.reduce((info: any, cls: { studentClassesIds: any[]; classCode: any; }) => {
          return [...info, ...cls.studentClassesIds.map(studentId => ({ studentId, classCode: cls.classCode }))];
        }, []);
  
        // Filter out students whose id is not present in any studentClassesIds
        const filteredStudents = studentsResponse.filter((student: { id: any; }) =>
          allStudentInfo.some((info: { studentId: any; }) => info.studentId === student.id)
        );
  
        // Group students by classCode
        const groupedStudents = filteredStudents.reduce((grouped: { [x: string]: any[]; }, student: { id: any; }) => {
          const matchingInfo = allStudentInfo.find((info: { studentId: any; }) => info.studentId === student.id);
          const classCode = matchingInfo ? matchingInfo.classCode : null;
          if (!grouped[classCode]) {
            grouped[classCode] = [];
          }
          grouped[classCode].push({ ...student, classCode });
          return grouped;
        }, {});
  
        // Save the grouped students to state
        setDroppedStudents(groupedStudents);
        console.log(groupedStudents);
        
        const totalStringsCount = classesResponse.reduce((acc: any, obj: { studentClassesIds: string | any[]; }) => {
          if (obj.studentClassesIds) {
            // Add the length of the studentClassesIds array to the accumulator
            return acc + obj.studentClassesIds.length;
          }
          return acc;
        }, 0);
        
        console.log('Total count of strings:', totalStringsCount);
  
        setClasses(classesResponse);
        setStudents(studentsResponse);
        setOriginalStudentsLength(totalStringsCount);
  
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

    setIsChanged(true)
    const studentEmail = e.dataTransfer.getData('text/plain');
    const draggedStudent = students?.find((student) => student.email === studentEmail);
  console.log(draggedStudent)
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
  
    /*       setStudents((prevStudents) =>
            prevStudents?.filter((student) => student.id !== draggedStudent.id)
          ); */
        }

        return updatedDroppedStudents;
      });
    }
  }
  
  
  const handleDelete = (ID: string) => {
    // Create a new object with updated values
    setIsChanged(true)
    const updatedDroppedStudents: { [classCode: string]: StudentsProps[] } = {};
  
    for (const classCode in droppedStudents) {
      if (droppedStudents.hasOwnProperty(classCode)) {
        // Filter out the student with the specified ID from the current classCode
        const updatedStudents = droppedStudents[classCode].filter(student => student.id !== ID);
        // Update the updatedDroppedStudents object with the filtered array
        updatedDroppedStudents[classCode] = updatedStudents;
      }
    }

    setClasses((prevClasses) => {
      if (!prevClasses) {
        return prevClasses; // If prevClasses is undefined, return it as is
      }
    
      const updatedClasses = prevClasses.map((cl) => {
        // Check if the studentClassesIds array includes the specified ID
        const updatedStudentClassesIds = cl.studentClassesIds?.filter(studentId => studentId !== ID);
    
        // If the class still has students after filtering, update it; otherwise, exclude it
        return {
          ...cl,
          studentClassesIds: updatedStudentClassesIds,
        };
      });
    
      return updatedClasses;
    });
    


    // Update the state with the new object
    setDroppedStudents(updatedDroppedStudents);
  };
  

   useEffect(()=>{

    if (isChahnged) {
    setIsUpdated(true)

    }
  },[classes,droppedStudents]) 



const handleSubmit = () =>{ 
  console.log(classes)
  setIsChanged(false)
  setIsUpdated(false)
  console.log(droppedStudents)
  const fetchData = async () => {
    try {
      const response = await updateStudentsInClass(classes);
    } catch (err) { 
      console.log(err)
    }
    }
    fetchData()
 
  } 

  return (
    <div className='flex flex-col items-center justify-center'> 
    
   {!isLoading ? (
    <>
    <div className='mt-10'> Drag and drop students to the class</div>
    <div className=' flex justify-around w-full mt-4'>
        
{isUpdated && 
      <div className='absolute cursor-pointer top-20 right-20 w-[80px] h-[80px] bg-green-300 flex justify-center items-center hover:bg-green-800 hover:text-white '
          onClick={handleSubmit}
      >
       <IoMdCheckmark size={30}/>
      </div>
}
    <div className='flex flex-col text-base '>
 
    {students?.map((student) => {
      const matchingClass = classes.find((classItem) =>
        classItem.studentClassesIds?.includes(student.id)
      );
  
  
      if (!matchingClass ) {
        return (
          <div
            key={student.email}
            className='flex gap-5'
            draggable
            onDragStart={(e) => handleDragStart(e, student)}
          >
            <div className='flex bg-gray-100 text-black font-semibold gap-2 py-1 border border-solid border-1 w-[150px] mt-1 px-1 rounded'>
            <div>{student?.l_name}</div>      <div>{student?.f_name}</div>
            </div>
          </div>
        );
      }
  
      return null; // Return null if a matching class is found or student is in the students array
    })}

  </div>

  <div className='max-h-[450px] overflow-y-auto'>
  {classes?.map((cl) => (
    <div
      key={cl.classCode}
      className="relative border border-solid bg-gray-100 text-black border-gray-300 min-h-[120px] w-[300px]  md:min-w-[400px] overflow-y-auto overflow-x-hidden mt-2 pl-2 "
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
      }}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, cl.classCode)}
    >
      {/* Sticky content */}
      <div className="sticky top-0 text-xl w-[150px] flex flex-col">
        <p className='text-base md:text-2xl font-bold' >{cl.classCode}-{cl.language}</p>
        <p className='text-xs'>{cl.schedule}</p>
        <div>
          {cl.teacherClasses?.map((teacher) => (
            <div key={teacher.id}>
              <p className='font-bold text-base md:text-base  mt-4'>{teacher.f_name} {teacher.l_name}</p>
            </div>
          ))}
        </div>
        <p className='text-xs md:text-base '>Total students {droppedStudents[cl.classCode]?.length}</p>
      </div>

      {/* Display dropped students here */}
      {droppedStudents[cl.classCode] && (
        <div className="absolute right-1 top-1 max-w-[160px] w-[160px] md:max-w-[220px] md:w-[220px]">
          <ul className="">
            {droppedStudents[cl.classCode].map((student) => (
              <li key={student.id} className='text-left '>
              <div className='flex between  border border-solid border-gray-300'>
                <div className='flex-1 text-base ml-2'>
               {student.l_name} {student.f_name}
                </div>
                <div
                    className='mr-2 w-[20px] flex justify-center items-center text-base cursor-pointer hover:font-bold hover:bg-red-500 hover:text-white'
                    onClick={() => handleDelete(student.id)}
                  >
                    x
                  </div>
              </div>
            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ))}
</div>



    

    </div>
    </>
  

  ) : (
    <>
         <div className='w-screen h-screen flex justify-center items-center'>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
    
    
            </>
 )}
    </div>
  );
}

export default Classes;
