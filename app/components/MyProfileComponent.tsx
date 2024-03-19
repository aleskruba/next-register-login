"use client"
import React,{useState,useEffect,ChangeEvent,FormEvent } from 'react'
import { fetchClasses, fetchMyProfile, updatePassword, updateProfileImage, updateStudent} from "@/utils";
import { StudentsProps } from '@/types';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import axios from 'axios';

type Student = {
  id: string;
  f_name: string;
  l_name: string;
  email: string;
}

function MyProfileComponent({id}:any) {

    const router = useRouter()
    const [updateSelected,setUpdateSelected] = useState(false)  
    const [student,setStudent] = useState<StudentsProps>()
    const [classes, setClasses] = useState<any>([]);
    const [isLoading,setIsLoading] = useState(true)
    const [classCodeError, setClassCodeError] = useState<string | null>(null);
    const [passwordError,setPasswordError] = useState<string | null>(null);
    const [changePasswordDiv,setChangePasswordDiv] = useState(false)
    const [newPassword,setNewPassword] = useState({
      password:'',
      repeatpassword:''
    })
    const [updatedStudent, setUpdatedStudent] = useState<StudentsProps>({
        id: '',
        email: '',
        f_name: '',
        l_name: '',
        classesIds:[],
        classes: [],
        gradesIds:[],
        gradeses: []
          });


          const [url,setUrl] = useState('');
          const [image, setImage] = useState<File | undefined>();
          const [forceUpdate, setForceUpdate] = useState(false); 


    useEffect(() =>{
      const fetchData = async () => { 
        const response = await fetchMyProfile(id)
        const allClasses = await fetchClasses();
    
        setStudent(response)
        setUrl(response.image)
        setClasses(allClasses);
        setIsLoading(false)

        
    }
    fetchData()
        },[]);



      const studentClasses = classes.filter((cl: { studentClassesIds: string | string[]; }) => cl.studentClassesIds?.includes(student?.id || "")).map((cl: { classCode: any; }) => cl.classCode);



       const handleEditClick = (ID:any) => {
            setUpdateSelected(true)
  
        setUpdatedStudent({
          id: student?.id || '',       
          email: student?.email || '', 
          f_name: student?.f_name || '', 
          l_name: student?.l_name || '',
          classesIds:[''],
          classes: [],
          gradesIds:[],
          gradeses: []
  
        });
  
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        setUpdatedStudent({ ...updatedStudent, [name]: value });
        
      };
      
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
       
        try{
          const fetchFunc = async () => {
          const response = await updateStudent(updatedStudent) 

          if (response.message = 'success') {
            toast.success('Updated successfully');
            router.push('/students')
          }
          }
          fetchFunc()
  
        } catch(err){
          console.log(err)
          toast.error('Student has not bee Updated  successfully');
        }
      
      }
 

   

      const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
      
        if (selectedFile) {
          // Check if the selected file type is valid
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
          if (!allowedTypes.includes(selectedFile.type)) {
            alert('Invalid file type. Only JPEG, JPG, or PNG images are allowed.');
            return;
          }
      
          setImage(selectedFile);
          setForceUpdate(prevState => !prevState); // Toggle the state to force re-render
        }
      };
      


      const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

        if (!cloudinaryUrl) {
          console.error("Cloudinary URL is not defined    !");
          return null; // or handle the error in some way
        }

        const uploadImage = async () => {
          try {
            // Ensure that 'image' is defined here
            if (!image) {
              // Handle case where image is not defined
              console.error('No image selected for upload');
              return;
            }
        
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(image.type)) {
              alert('Invalid file type. Only JPEG, JPG, or PNG images are allowed.');
              return;
            }
        
            const formData = new FormData();
            formData.append('file', image);
        
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
        
            const data = { imageUrl: imageUrl };
            const response = await updateProfileImage(data);
        
            if (response.data === 'success') {
              toast.success('Image updated successfully');
            } else {
              toast.error('Image not updated successfully');
            }
        
            setImage(undefined);
          } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
          }
        };
        
      

      
  
 const handleChangePassword =  (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setNewPassword({ ...newPassword, [name]: value });
}


const handleSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault(); 

  const passwordRegex = /^.{8,}$/;
  const isValidPassword = passwordRegex.test(newPassword.password); // Pass password string here
  try {
    if (newPassword.password !== newPassword.repeatpassword) {
      setPasswordError('Passwords must match');
    } 

    if (!isValidPassword) {
        setPasswordError('Passwords must contain at least 8 characters');
    }else {
      const data = {
        userID:student?.id,
        password: newPassword.password,
        repeatpassword: newPassword.repeatpassword
      };

      const response = await updatePassword(data);
      
      if (response.data === 'Success') {
        setNewPassword({
          password:'',
       repeatpassword:''})
        toast.success('Password updated successfully')
        setChangePasswordDiv(false)
      }
      setPasswordError(''); 
    }
  } catch (err) {
    console.log(err);
  }
};


      
  return (<>

    <div className="mt-20 flex justify-center flex-col">
    

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
          <div>email : </div> <div>{student?.email}</div>
        </div>
        <div className="flex justify-between w-full">
         <div>name: </div><div>{student?.f_name}</div>
        </div>
        <div className="flex justify-between w-full">
          <div>last name:</div><div>{student?.l_name}</div>
          </div>
  {/*         <div className="flex justify-between w-full">
           <div>role: </div><div>{student?.role}</div>
         </div> */}
              <div className="flex justify-between w-full">
          <div>class:</div><div> {studentClasses.join(", ")}</div>
        </div>
        <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>

        {!isLoading &&
          <div className="px-5 mt-4 flex justify-center w-full">
          <button className="px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white w-[150px]"
              onClick={()=>handleEditClick(student?.id)}> 
              update 
          </button>
        {/*   <button onClick={()=>setImage(undefined)}
              className=' px-2 py-2 rounded text-white bg-slate-500 hover:bg-slate-400 w-[150px]'
              >Cancel
          </button> */}
      </div>
          }

 
    </> : <> 
     
    <form onSubmit={handleSubmit} className="w-full">
    <div className="flex justify-between w-full ">
  
          <div>email : </div> <input type="email" disabled value={updatedStudent?.email} className="bg-gray-500 " name="email" onChange={handleChange}/>
        </div>
        <div className="flex justify-between w-full mt-1">
         <div>name: </div><input type="text" value={updatedStudent?.f_name} className="bg-gray-200" name="f_name"  onChange={handleChange}/>
        </div>
        <div className="flex justify-between w-full mt-1">
          <div>last name:</div><input type="text" value={updatedStudent?.l_name} className="bg-gray-200" name="l_name" onChange={handleChange}/>

          </div>

              <div className="flex justify-between w-full mt-1">
          <div>class:</div><div> {studentClasses.join(", ")}</div>
        </div>
        <p className='text-xs text-red-600'> {classCodeError && classCodeError}</p>
        {!isLoading  &&
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
        {!changePasswordDiv ?
        <div className="  mt-5 px-5 py-5 min-w-[380px] md:min-w-[480px] text-gray-900 flex flex-col  items-center justify-center  border border-solid border-1 text-xl bg-gray-100 hover:bg-blue-500"
              onClick={()=>{setChangePasswordDiv(true)}}>
          Change password
       </div>

      :

       <form onSubmit={handleSubmitPassword} className="w-full bg-gray-100 px-5 mt-4 py-4">
         <div className="flex justify-between   ">
  
          <div className="text-xs md:text-l lg:text-xl pl-2 pr-2 text-black">New Password : </div> 
                <input type="password" 
                      // placeholder="password" 
                       autoComplete="new-password" 
                       value={newPassword.password}
                       className="bg-gray-200 px-2 max-w-[230px] lg:max-w-[280px]" 
                       name="password" 
                       onChange={handleChangePassword}/>
        </div>
        <div className="flex justify-between  mt-1">
         <div className="text-xs md:text-l lg:text-xl pl-2 pr-2  text-black ">Repeat Password: </div>
                <input type="password" 
                      // placeholder="repeat password" 
                       autoComplete="new-password" 
                       value={newPassword.repeatpassword}
                       className="bg-gray-200 px-2 max-w-[230px] lg:max-w-[280px]" 
                       name="repeatpassword"  
                       onChange={handleChangePassword}/>
        </div>
        <div className="px-5 mt-4 mb-4 flex justify-between w-full">
        <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white " type="submit" >
          save 
        </button>
        <button  className="px-8 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white "   
                 onClick={()=>{setChangePasswordDiv(false),setPasswordError(''),
                               setNewPassword({password:'',repeatpassword:''}) }}>
                                  cancel
          </button>
      </div >
      <div className="text-center text-red-500 text-base md:text-l lg:text-xl ">
          {passwordError && passwordError}
          </div>
   </form>
      }
      </>
      :<>
              <div className='w-screen h-screen flex justify-center items-center '>
            <img src="/spinner.svg" alt="" className="w-[100px]"/>
          </div>
      </>
      }
     </div>
     </>
)
}

export default MyProfileComponent