import { StudentsProps } from '@/types'
import { fetchStudent } from '@/utils'
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pusher from 'pusher-js';

export const MyGradesStudent = ({id}:any) => {

    const [student,setStudent] = useState<StudentsProps>()
    const [isLoading,setIsLoading] = useState(true)
    const [newGradeStyle,setNewGradeStyle] = useState('' || null)

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetchStudent(id);
               setStudent(response);
               setIsLoading(false)
          
            } catch (e) {
                console.error('Error fetching student data:', e);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {

      if (student) {

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
          cluster: 'eu', // Your cluster
        });
      
        const channel = pusher.subscribe(student.id);

        channel.bind('new-grade', (response:any) => {
          console.log(response.gradeses)
          setNewGradeStyle(response.gradeses.id)
          setTimeout(() => {
            setNewGradeStyle(null)
          }, 1500);

            setStudent({...student, gradeses: [...student.gradeses, response.gradeses]})

       });
  
      channel.bind('delete-grade', (response: any) => {
        const gradetoDelete = response.deleteGrade.id
        console.log(gradetoDelete)
        setStudent({...student, gradeses: [...student.gradeses.filter(grade => grade.id !== gradetoDelete) ]} )
      
      }); 

        channel.bind('udpated-grade', (response: any) => {
          const gradetoUpdate = response.gradeses

          setStudent(prevStudent => {
            if (!prevStudent) return prevStudent; // If student state is not initialized, return it as is
          
            return {
              ...prevStudent,
              gradeses: prevStudent.gradeses.map(grade => {
                if (grade.id === gradetoUpdate.id) {
                  return { ...gradetoUpdate }; // Update the grade object
                }
                return grade; // Return the grade object unchanged
              })
            };
          });
        })  

        
 

    
  
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
      }
      }, [student]); 
  


    return (
        <div className='mt-8  h-screen'>
          {!isLoading ? (
            <>
              <div className='  flex items-center  flex-col px-2'>
                <div className="grid grid-cols-4 gap-4 text-xs mt-4 w-full">
                  <div className="col-span-1  flex justify-center  ">
                    <h3 className="font-semibold">Value</h3>
                  </div>
                  <div className="col-span-1 ">
                    <h3 className="font-semibold">Comment</h3>
                  </div>
                  <div className="col-span-1 ">
                    <h3 className="font-semibold">Created On</h3>
                  </div>
                  <div className="col-span-1 ">
                    <h3 className="font-semibold">Updated On</h3>
                  </div>
                </div>
                {student?.gradeses.map((grade,idx) => {
               //   console.log(grade)
                  const formattedCreatedAt = moment(grade?.createdAt).format('DD.MM YY');
                  const formattedUpdatedAt = moment(grade?.updatedAt).format('DD.MM YY');
                  return (
                    <div key={idx}       className={`grid grid-cols-4 gap-4 text-base my-1 border-b border-b-1 w-full px-2 ${newGradeStyle && grade.id == newGradeStyle ? 'newGradeStyle' : ''}`}
                    >
                      <div className='text-center'>
                        <p className='font-bold text-xl'>{grade?.value}</p>
                      </div>
                      <div className=''>
                        <p>{grade?.comment}</p>
                      </div>
                      <div className=''>
                        <p>{formattedCreatedAt}</p>
                      </div>
                      <div className=''>
                        <p>{formattedUpdatedAt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className=' h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div>
          )}
        </div>
      );
      
}
