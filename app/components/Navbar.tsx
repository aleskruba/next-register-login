"use client";
import React,{useState,useRef,useEffect} from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/DarkModeToggle";
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { IoMdMenu, IoMdClose } from "react-icons/io"


const Navbar = () => {

  const {session,currentUser,setCurrentUser} = useUserContext()
  const router = useRouter()
  const [navbar, setNavbar] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    let handler = (e:MouseEvent) => {
      
      if(menuRef.current &&!menuRef.current.contains(e.target as Node)) {
         // setOpen(false)
          setNavbar(false)

      }
    }
    document.addEventListener('mousedown', handler)

    return() => {
      document.removeEventListener('mousedown',handler)
    }
})

  return (
    <header className="w-full mx-auto text-lg md:px-4 pt-6  sm:px-4 fixed left-0 top-0 z-50 shadow bg-white dark:bg-stone-900  md:opacity-100  dark:border-b dark:border-stone-600">
          <div className="md:hidden absolute left-3 top-1 text-base  text-green-400"  >     {session && session.user?.email}  
  </div> 
  <div  className="md:hidden absolute right-3 top-1 text-base  "> <ModeToggle/></div>
         <div className="md:hidden"  >
              <button
                className="p-2 mt-2 text-gray-800 dark:text-gray-100 rounded-md outline-none focus:border-gray-400 focus:border "
                onClick={() =>{ setNavbar(!navbar); /* setOpen(true) */}}
              
              >
                {navbar ? <div ><IoMdClose size={30}/></div>  : <IoMdMenu size={30} />}
              </button>
            </div>
      <div ref={menuRef}        className={`md:block w-screen m-2 ${
              navbar ? "block" : "hidden"
            }`}  > 
      <ul className="flex flex-col md:flex-row w-full justify-around  item-center md:pt-4" >

          <Link href="/">
            <li className="hover:text-gray-500">Home</li>
          </Link>
   
           
        {!session ? ( 
            <ul className="flex md:gap-5  flex-col md:flex-row ">
              <Link href="/login">
                <li className="hover:text-gray-500">Login</li>
              </Link>
              <Link href="/admin/register">
                <li className="hover:text-gray-500">Register</li>
              </Link>
            </ul>
       ) : ( 
            <>
      
               {currentUser?.role === "Admin" && 
                    <>
                       <Link href='createclass'>
                         <li className="hover:text-gray-500">Create class</li>  
                      </Link>

                      <Link href='managaclasses'>
                         <li className="hover:text-gray-500">Manage classes</li>  
                      </Link>

                      <Link href='createclass'>
                         <li className="hover:text-gray-500">Students</li>  
                      </Link>

                      <Link href='createclass'>
                         <li className="hover:text-gray-500">Teachers</li>  
                      </Link>
        
                      <Link href="/dashboard">
                          <li className="hover:text-gray-500">Dashboard</li>
                      </Link>
                   </>
                   }
                   
                 {currentUser?.role === "Student" && 
                   <Link href="/student">
                   <li className="hover:text-gray-500">Student zone</li>
                 </Link>}  
                 {currentUser?.role === "Teacher" && 
                   <Link href="/teacher">
                   <li className="hover:text-gray-500">Teacher zone</li>
                 </Link>}  

              <li>
                <button
                  onClick={() => {
                    signOut();
                    router.replace("/");
                    setCurrentUser(null)
       
          
                  }}
                  className=" px-5  bg-blue-300 rounded-full mt-4 md:mt-0 hover:bg-blue-500"
                >
                  Logout
                </button>
              </li>
            </>
           )} 
     
       </ul>
       <div className=" hidden md:block text-base  text-green-400 absolute left-20 md:left-10 top-1" >
         {session && session.user?.email}   
       </div>

          <div className="hidden md:block  absolute right-5 top-1">
             <ModeToggle/>

            </div>
      </div>

    </header>
  );
};

export default Navbar;