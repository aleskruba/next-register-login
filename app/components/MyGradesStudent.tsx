import { StudentsProps } from '@/types'
import { fetchStudent } from '@/utils'
import React, { useState, useEffect } from 'react';
import moment from 'moment';

export const MyGradesStudent = ({id}:any) => {

    const [student,setStudent] = useState<StudentsProps>()
    const [isLoading,setIsLoading] = useState(true)

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




    return (
        <div className='mt-8  '>
          {!isLoading ? (
            <>
              <div className=' h-screen flex items-center  flex-col '>
                <div className="grid grid-cols-4 gap-4 text-xs mt-4">
                  <div className="col-span-1  ">
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
                {student?.gradeses.map(grade => {
                  const formattedCreatedAt = moment(grade.createdAt).format('DD.MM YY');
                  const formattedUpdatedAt = moment(grade.updatedAt).format('DD.MM YY');
                  return (
                    <div key={grade.id} className={`grid grid-cols-4 gap-4 text-base my-1 border-b border-b-1 `}>
                      <div className=''>
                        <p>{grade.value}</p>
                      </div>
                      <div className=''>
                        <p>{grade.comment}</p>
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
