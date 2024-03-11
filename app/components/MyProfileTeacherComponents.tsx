"use client"
import React,{useState,useEffect,ChangeEvent,FormEvent } from 'react'
import { fetchClasses, fetchMyProfileTeacher, updateProfileImage, updateTeacherProfile} from "@/utils";
import { TeachersProps } from '@/types';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import axios from 'axios';



function MyProfileTeacherComponents({id}:any) {

    const router = useRouter()
    const [updateSelected,setUpdateSelected] = useState(false)  
    const [teacher,setTeacher] = useState<TeachersProps>()
    const [classes, setClasses] = useState<any>([]);
    const [isLoading,setIsLoading] = useState(true)
    const [classCodeError, setClassCodeError] = useState<string | null>(null);
    const [updatedTeacher, setUpdatedTeacher] = useState<TeachersProps>({
        id: '',
        email: '',
        f_name: '',
        l_name: '',
        classesIds:[],
        classes: [],
        gradesIds: [],
        grades: []
          });

    const [url,setUrl] = useState('');
    const [image, setImage] = useState<File | undefined>();
    const [forceUpdate, setForceUpdate] = useState(false); 

    useEffect(() =>{
      const fetchData = async () => { 
        const response = await fetchMyProfileTeacher(id)
        const allClasses = await fetchClasses();
    
        
        setTeacher(response)
        setUrl(response.image)
        setClasses(allClasses);
        setIsLoading(false)

        
    }
    fetchData()
        },[]);



      const teacherClasses = classes.filter((cl: { teacherClassesIds: string | string[]; }) => cl.teacherClassesIds?.includes(teacher?.id || "")).map((cl: { classCode: any; }) => cl.classCode);



       const handleEditClick = (ID:any) => {
       
        setUpdateSelected(true)
  
        setUpdatedTeacher({
          id: teacher?.id || '',       
          email: teacher?.email || '', 
          f_name: teacher?.f_name || '', 
          l_name: teacher?.l_name || '',
          classesIds:[],
          classes: [],
          gradesIds: [],
          grades: []
  
        });
  
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        setUpdatedTeacher({ ...updatedTeacher, [name]: value });
  
      };
      
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
   
        try{
          const fetchFunc = async () => {
          const response = await updateTeacherProfile(updatedTeacher) 

          if (response.message = 'success') {
            toast.success('Updated successfully');
            router.push('/')
          }
          }
          fetchFunc()
  
        } catch(err){
          console.log(err)
          toast.error('Teacher has not bee Updated  successfully');
        }
      
      }

      const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
    
        if (selectedFile) {
          setImage(selectedFile);
          setForceUpdate(prevState => !prevState); // Toggle the state to force re-render
        }
      };

      const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

      if (!cloudinaryUrl) {
        console.error("Cloudinary URL is not defined!");
        return null; // or handle the error in some way
      }

      const uploadImage = async () => {
        try {
          const formData = new FormData();
          formData.append('file', image!); // Ensure that 'image' is defined here
      
          const cloudinaryUploadResponse = await axios.post(
            cloudinaryUrl,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              params: {
                upload_preset: 'schoolapp',
              },
            }
          );
      
          const imageUrl = cloudinaryUploadResponse.data.secure_url;
          setUrl(imageUrl);

          const response = await updateProfileImage(imageUrl)
       
            if (response.data === 'success') { 
              toast.success('Image updated successfully')
            }
            else { 
              toast.error('Image not updated successfully')
            }

            setImage(undefined)

       //   console.log('Cloudinary Upload Response:', cloudinaryUploadResponse.data);
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
        }
      };
      
 
  return (
    <div className="flex justify-center flex-col">
      
    {!isLoading ? <>  

      <div className="  mt-10 px-5 py-5 min-w-[380px] md:min-w-[480px] text-gray-900 flex flex-col  items-center justify-center  border border-solid border-1 text-xl bg-gray-100">
        <div className=''>
        <img    src={image ? URL.createObjectURL(image) : url ?  url: '../placeholder.jpg'} alt="" className='mb-4 w-[150px] h-[150px] rounded-full object-cover'/>
         </div>
          <label htmlFor="imageInput" className="cursor-pointer">
            <span className="relative">
              <input
                type="file"
                id="imageInput"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className=" bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer">
                Choose a new photo
              </span>
            </span>
          </label>
         {image && 
         
     
         <div className='flex gap-4 justify-between w-full '>
          <button onClick={uploadImage}
                className='mt-4 px-2 py-2 rounded text-white bg-blue-500 hover:bg-blue-800 w-[150px]'
                >Update Image
          </button>
                <button onClick={()=>setImage(undefined)}
                className='mt-4 px-2 py-2 rounded text-white bg-slate-500 hover:bg-slate-400 w-[150px]'
                >Cancel
          </button>
          </div>
}
      </div>
      <div className="mt-5 px-5 py-5 min-w-[380px] md:min-w-[480px] text-gray-900 flex flex-col items-start border border-solid border-1 text-xl bg-gray-100">


    {!updateSelected ? <>

      <div className="flex justify-between w-full ">
        <div>email : </div> <div>{teacher?.email}</div>
      </div>
      <div className="flex justify-between w-full">
       <div>name: </div><div>{teacher?.f_name}</div>
      </div>
      <div className="flex justify-between w-full">
        <div>last name:</div><div>{teacher?.l_name}</div>
        </div>
{/*         <div className="flex justify-between w-full">
         <div>role: </div><div>{student?.role}</div>
       </div> */}
            <div className="flex justify-between w-full">
        <div>class:</div><div> {teacherClasses.join(", ")}</div>
      </div>
      <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>

      {!isLoading &&
      <div className="px-5 mt-4 flex justify-between w-full">

      <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded  text-white"
           onClick={()=>handleEditClick(teacher?.id)}> 
         update 
      </button>
      <button         className="px-8 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white "            onClick={()=>{   router.push('/')}}
                    >
        cancel
         </button>
  
      </div>}


  </> : <>
  <form onSubmit={handleSubmit} className="w-full">
  <div className="flex justify-between w-full ">

        <div>email : </div> <input type="email" value={updatedTeacher?.email} className="bg-gray-200" name="email" onChange={handleChange}/>
      </div>
      <div className="flex justify-between w-full mt-1">
       <div>name: </div><input type="text" value={updatedTeacher?.f_name} className="bg-gray-200" name="f_name"  onChange={handleChange}/>
      </div>
      <div className="flex justify-between w-full mt-1">
        <div>last name:</div><input type="text" value={updatedTeacher?.l_name} className="bg-gray-200" name="l_name" onChange={handleChange}/>

        </div>

            <div className="flex justify-between w-full mt-1">
        <div>class:</div><div> {teacherClasses.join(", ")}</div>
      </div>
      <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>
      {!isLoading &&
      <div className="px-5 mt-4 flex justify-between w-full">

      <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white " type="submit">
          
         save 
      </button>
      <button         className="px-8 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white "            onClick={()=>{setUpdateSelected(false)}}
                    >
        cancel
         </button>
      </div>}
      </form>
       </>
  
  }
      </div>


    </>
    :<>
             <div className='w-screen h-screen flex justify-center items-center'>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
    </>
    }
   </div>
  )
}

export default MyProfileTeacherComponents