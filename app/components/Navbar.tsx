"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/DarkModeToggle";
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const {session,currentUser,setCurrentUser} = useUserContext()
  const router = useRouter()


  return (
    <div>
      <ul className="flex w-full justify-between m-10 item-center">
        <div>
          <Link href="/">
            <li>Home</li>
          </Link>
        </div>
        <div className="flex gap-10">
        
        {!session ? ( 
            <>
              <Link href="/login">
                <li>Login</li>
              </Link>
              <Link href="/admin/register">
                <li>Register</li>
              </Link>
            </>
       ) : ( 
            <>
            {session.user?.email}       
               {currentUser?.role === "Admin" && 
                   <Link href="/dashboard">
                   <li>Dashboard</li>
                 </Link>}  
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
        </div>
            <div>
              <li>
             <ModeToggle/>

            </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;