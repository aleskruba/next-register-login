"use client";
import React,{useState} from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/DarkModeToggle";

const Navbar = () => {
 // const { data: session }: any = useSession();
 
  return (
    <div>
      <ul className="flex w-full justify-between m-10 item-center">
        <div>
          <Link href="/">
            <li>Home</li>
          </Link>
        </div>
        <div className="flex gap-10">
          <Link href="/dashboard">
            <li>Dashboard</li>
          </Link>
         {/*  {!session ? ( */}
            <>
              <Link href="/login">
                <li>Login</li>
              </Link>
              <Link href="/register">
                <li>Register</li>
              </Link>
            </>
      {/*     ) : ( */}
            <>
      {/*         {session.user?.email} */}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="p-2 px-5 -mt-1 bg-blue-800 rounded-full"
                >
                  Logout
                </button>
              </li>
            </>
{/*           )} */}
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