import { ClassArray } from '@/types';
import { fetchClasses } from '@/utils';
import React, { useEffect, useState } from 'react';

function Classes() {
  const [classes, setClasses] = useState<ClassArray>();

  try {
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetchClasses();
        console.log(response);
        setClasses(response);
      };
      fetchData();
    }, []);
  } catch (err) {
    console.log(err);
  }

  return (
    <div>
      Classes
      <div>
        {classes?.map((cl) => (
          <div key={cl.classCode} className="border border-solid border-black">
            <p>{cl.classCode}</p>
            <p>{cl.language}</p>
            <p>{cl.schedule}</p>
            <div>
              {cl.teacherClasses?.map((teacher) => (
                <div key={teacher.id}>
                  <p>{teacher.f_name}</p>
                  <p>{teacher.l_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;
