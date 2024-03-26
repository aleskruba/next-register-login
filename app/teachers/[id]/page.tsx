"use client"
import Navbar from "@/app/components/Navbar";
import { useRouter } from 'next/navigation'
import { TeachersProps, ClassArray} from "@/types";
import { deleteTeacher, fetchClasses, fetchTeacher, updatePassword, updateProfileImage, updateTeacher } from "@/utils";
import toast from "react-hot-toast";
import { FC,useEffect,useState,ChangeEvent,FormEvent } from "react";
import axios from 'axios';


interface Props {
     params: 
     { id: string }
}
    

 
const Post: FC<Props> = ({params}) => {

  const router = useRouter()

    const [updateSelected,setUpdateSelected] = useState(false)  
    const [teacher,setTeacher] = useState<TeachersProps>()
    const [classes, setClasses] = useState<ClassArray>([]);
    const [isLoading,setIsLoading] = useState(true)
    const [classCodeError, setClassCodeError] = useState<string | null>(null);
    const [passwordError,setPasswordError] = useState<string | null>(null);
    const [changePasswordDiv,setChangePasswordDiv] = useState(false)
    const [newPassword,setNewPassword] = useState({
      password:'',
      repeatpassword:''
    })

    const [updatedTeacher, setUpdatedTeaacher] = useState<TeachersProps>({
      id: '',
      email: '',
      f_name: '',
      l_name: '',
      role: '', 
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
        const response = await fetchTeacher(params.id)
        const allClasses = await fetchClasses();

         setTeacher(response)
         setUrl(response.image)
         setClasses(allClasses);
         setIsLoading(false)
        }
  
        fetchData()
    },[]);

    const teacherClasses = classes
    .filter((cl) => cl.teacherClassesIds?.includes(teacher?.id || ""))
    .map((cl) => cl.classCode);

    
    const handleEditClick = (ID:any) => {
      console.log(ID)
      setUpdateSelected(true)

      setUpdatedTeaacher({
        id: teacher?.id || '',       
        email: teacher?.email || '', 
        f_name: teacher?.f_name || '', 
        l_name: teacher?.l_name || '', 
        role: teacher?.role || '',  
        classesIds:[],
        classes: [],
        gradesIds: [],
        grades: []
      });

    }


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
  
      setUpdatedTeaacher({ ...updatedTeacher, [name]: value });

    };

    const handleDelete = (ID:any) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this student?");

        if (isConfirmed) {
          console.log(ID);
      try{
        setIsLoading(true)
        const fetchData = async () => {
          const response = await deleteTeacher(ID)
     
          if (response.message === 'unauthorized'){
            setClassCodeError('Class must be empty.');
          console.log('unauthorized')
          setIsLoading(false)  
        }
          router.push('/teachers')
          setIsLoading(false)  
        }
        fetchData()
 
      }catch(err){
        console.log(err)
   
      }
    }

    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); 
      console.log(updatedTeacher);

      try{
        const fetchFunc = async () => {
        const response = await updateTeacher(updatedTeacher) 
        console.log(response)
        if (response.message = 'success') {
          toast('Updated successfully', {
            style: {
              background: '#4CAF50', // Green background color
              color: '#FFFFFF', // White text color
              border: '1px solid #388E3C', // Dark green border
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for depth
              fontSize: '12px', // Font size
              padding: '16px', // Padding
            },
          });
          router.push('/teachers')
        }
        }
        fetchFunc()

      } catch(err){
        console.log(err)
        toast.error('Student has not bee Updated  successfully');
      }
    
    }
  useEffect(() => {

  },[updatedTeacher.role])

  
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

      const data =  {imageUrl:imageUrl, userID:teacher?.id , role:teacher?.role}

      const response = await updateProfileImage(data)
   
        if (response.data === 'success') { 
          toast('Image updated successfully', {
            style: {
              background: '#4CAF50', // Green background color
              color: '#FFFFFF', // White text color
              border: '1px solid #388E3C', // Dark green border
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for depth
              fontSize: '12px', // Font size
              padding: '16px', // Padding
            },
          });
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
          userID:teacher?.id,
          password: newPassword.password,
          repeatpassword: newPassword.repeatpassword
        };
  
        const response = await updatePassword(data);
        
        if (response.data === 'Success') {
          setNewPassword({
            password:'',
         repeatpassword:''})
         toast('Password Updated successfully', {
          style: {
            background: '#4CAF50', // Green background color
            color: '#FFFFFF', // White text color
            border: '1px solid #388E3C', // Dark green border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for depth
            fontSize: '12px', // Font size
            padding: '16px', // Padding
          },
        });
          setChangePasswordDiv(false)
        }
        setPasswordError(''); 
      }
    } catch (err) {
      console.log(err);
    }
  };
  

    return ( <>

      <Navbar/>
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
  
          <button className="px-8 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white  w-[150px] "
               onClick={()=>handleEditClick(teacher?.id)}> 
             update 
          </button>
          <button   className={`${
                           teacherClasses.length > 0
                            ? 'bg-red-200 text-gray-200 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                        } w-[150px] flex justify-center items-center  rounded px-8 py-2`}
                        disabled={  teacherClasses &&  teacherClasses.length > 0}
                        onClick={()=>handleDelete(teacher?.id)}
                        >
            delete
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
    
            <div className="text-xs md:text-l lg:text-xl pl-2 pr-2 ">New Password : </div> 
                  <input type="password" 
                        // placeholder="password" 
                         autoComplete="new-password" 
                         value={newPassword.password}
                         className="bg-gray-200 px-2 max-w-[230px] lg:max-w-[280px]" 
                         name="password" 
                         onChange={handleChangePassword}/>
          </div>
          <div className="flex justify-between  mt-1">
           <div className="text-xs md:text-l lg:text-xl pl-2 pr-2 ">Repeat Password: </div>
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
 
export default Post;