import { TeachersArray, ClassProps } from '@/types';
import { createClass, fetchTeachers } from '@/utils';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

const CreateClassComponent = () => {
  const [teachers, setTeachers] = useState<TeachersArray>();
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string>(''); // Initialize with an empty string

  const [newClass, setNewClass] = useState<ClassProps>({
    classCode: '',
    language: '',
    schedule: '',
    teacherID: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTeachers();
        setTeachers(response);
        setIsLoading(false);

        // Set the initial selected value after fetching teachers
        if (response && response.length > 0) {
          setSelected(response[0].l_name);
          setNewClass({
            ...newClass,
            teacherID: response[0].id,
          });
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Make sure to include an empty dependency array to run the effect only once

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setSelected(e.target.value);
    setNewClass({ ...newClass, teacherID: e.target.value });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
    console.log({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try { 
        const response = await createClass(newClass)
        console.log(response)
    } 
    catch(e) 
        {console.log(e);}
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col max-w-[350px]'>
      <input name='classCode' placeholder='classCode' onChange={handleChange} />
      <input name='language' placeholder='language' onChange={handleChange} />
      <input name='schedule' placeholder='schedule' onChange={handleChange} />

      <select name='teacherID' value={selected} onChange={handleChangeSelect}>
        {teachers?.map((teacher) => (
          <option value={teacher.id} key={teacher.email}>
            {teacher.l_name}
          </option>
        ))}
      </select>

      <input type='submit' value='save' />
    </form>
  );
};

export default CreateClassComponent;