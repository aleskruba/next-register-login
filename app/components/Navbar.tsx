"use client";
import React,{useState,useRef,useEffect} from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/DarkModeToggle";
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { IoMdMenu, IoMdClose } from "react-icons/io"
import { usePathname } from 'next/navigation'
import { useTheme } from "next-themes"


const Navbar = () => {
  const { resolvedTheme } = useTheme();
  const {session,currentUser,setCurrentUser} = useUserContext()
  const router = useRouter();
  const [navbar, setNavbar] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  useEffect(() => {
    // Highlight active menu item based on the current route

    // You may need to adjust the logic based on your actual routes
    const activeMenuItem = document.querySelector(`[href="${pathname}"]`);
    if (activeMenuItem) {
      // Add your styles for the active menu item
      activeMenuItem.classList.add("font-bold", "text-green-500");
    }

    return () => {
      // Clean up the styles when the component unmounts
      if (activeMenuItem) {
        activeMenuItem.classList.remove("font-bold", "text-green-500");
      }
    };
  }, [pathname]);

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
  <div  className="lg:hidden absolute right-3 top-1 text-base  "> <ModeToggle/></div>
         <div className="lg:hidden flex "  >
              <button
                className="p-2 mt-2 text-gray-800 dark:text-gray-100 rounded-md outline-none focus:border-gray-400 focus:border "
                onClick={() =>{ setNavbar(!navbar); /* setOpen(true) */}}
              
              >
                {navbar ? <div ><IoMdClose size={30}/></div>  : <IoMdMenu size={30} />}
              </button>

              <div className="pl-24 flex items-center font-thin text-2xl ">
                School App
              </div>
            </div>
      <div ref={menuRef}        className={`lg:block w-screen m-2 ${
              navbar ? "block" : "hidden"
            }`}  > 
          <ul className="flex flex-col lg:flex-row w-full justify-around item-center md:pt-4">
          {!session && 
        <li className="hidden md:block text-2xl font-thin ">WELCOME TO SCHOOL APP</li>
          }
          

    
        {!session ? (
          <ul className="flex md:gap-5 flex-col md:flex-row">
       
            <Link href="/login">
              <li className={pathname === "/login" ? "font-bold text-green-500" : "hover:text-green-500"}>Login</li>
            </Link>
             </ul>
        ) : (
          <>
            {currentUser?.role === "Admin" && (
              <>
                <Link href="/admin/register">
                  <li className={pathname === "/admin/register" ? "font-bold text-green-500" : "hover:text-green-500"}>Register a new user</li>
                </Link>
                <Link href='../createclass'>
                  <li className={pathname === "/createclass" ? "font-bold text-green-500" : "hover:text-green-500"}>Create class</li>
                </Link>

                <Link href='../manageclasses'>
                  <li className={pathname === "/manageclasses" ? "font-bold text-green-500" : "hover:text-green-500"}>Classes</li>
                </Link>

                <Link href='../students'>
                  <li className={pathname === "/students" ? "font-bold text-green-500" : "hover:text-green-500"}>Students</li>
                </Link>

                <Link href='../teachers'>
                  <li className={pathname === "/teachers" ? "font-bold text-green-500" : "hover:text-green-500"}>Teachers</li>
                </Link>

                <Link href="../dashboard">
                  <li className={pathname === "/dashboard" ? "font-bold text-green-500" : "hover:text-green-500"}>Add Students to Classes</li>
                </Link>
              </>
            )}

            {currentUser?.role === "Student" && (
          <>
                 <Link href="/">
          <li className={pathname === "/" ? "font-bold text-green-500" : "hover:text-green-500"}>Chat</li>
          </Link>
   
            <Link href={`/student/${currentUser.id}`}>
                <li className={pathname === "/student" ? "font-bold text-green-500" : "hover:text-green-500"}>My profile</li>
              </Link>

              <Link href={`/mygrades/${currentUser.id}`}>
                <li className={pathname === "/mygrades" ? "font-bold text-green-500" : "hover:text-green-500"}>My grades</li>
            </Link>
          </>
            )}

            {currentUser?.role === "Teacher" && (
             <>
                    <Link href="/">
          <li className={pathname === "/" ? "font-bold text-green-500" : "hover:text-green-500"}>Chat</li>
          </Link>
   
              <Link href={`/teacher/${currentUser.id}`}>
                      <li className={pathname === "/techer" ? "font-bold text-green-500" : "hover:text-green-500"}>My profile</li>
              </Link>
       
              <Link href={`/myclass/${currentUser.id}`}>
                  <li className={pathname === "/myclass" ? "font-bold text-green-500" : "hover:text-green-500"}>My class</li>
                </Link>
                
            </>
            )}

            <li>
              <button
                onClick={() => {
                  router.replace("/");
                  setTimeout(() => {   
                    signOut();
                    setCurrentUser(null)
                  }, 2000);
           
                }}
                className={`px-5  bg-blue-500 rounded-full mt-4 md:mt-0 hover:bg-blue-600 ${resolvedTheme === 'dark' ? 'text-white' : 'text-white'}`}
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