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
    <header className="w-full mx-auto text-lg md:px-4  sm:px-4 fixed left-0 top-0 z-50 shadow bg-white dark:bg-stone-900  md:opacity-100  dark:border-b dark:border-stone-600">
         <div className="md:hidden"  >
              <button
                className="p-2 text-gray-800 dark:text-gray-100 rounded-md outline-none focus:border-gray-400 focus:border "
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
            <li>Home</li>
          </Link>
   
           
        {!session ? ( 
            <ul className="flex md:gap-5  flex-col md:flex-row ">
              <Link href="/login">
                <li>Login</li>
              </Link>
              <Link href="/admin/register">
                <li>Register</li>
              </Link>
            </ul>
       ) : ( 
            <>
      
               {currentUser?.role === "Admin" && 
                    <>
                       <Link href='createclass'>
                         <li>Create class</li>  
                      </Link>
        
                      <Link href="/dashboard">
                          <li>Dashboard</li>
                      </Link>
                   </>
                   }
                   
                 {currentUser?.role === "Student" && 
                   <Link href="/student">
                   <li>Student zone</li>
                 </Link>}  
                 {currentUser?.role === "Teacher" && 
                   <Link href="/teacher">
                   <li>Teacher zone</li>
                 </Link>}  

              <li>
                <button
                  onClick={() => {
                    signOut();
                    router.replace("/");
                    setCurrentUser(null)
       
          
                  }}
                  className="p-2 px-5 -mt-1 bg-blue-800 rounded-full"
                >
                  Logout
                </button>
              </li>
            </>
           )} 
     
       </ul>
       <div className="text-base  text-green-400 absolute left-20 md:left-10 top-1" >
         {session && session.user?.email}   
       </div>

          <div className="absolute right-5 top-1">
             <ModeToggle/>

            </div>
      </div>

    </header>
  );
};

export default Navbar;