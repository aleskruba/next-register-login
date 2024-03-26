'use client'

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar'
import moment from 'moment'
import ChatBox from './components/ChatBox';
import { useUserContext } from "../context/auth-context";
import ChooseChatBox from './components/ChooseChatBox';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {

  const [position, setPosition] = useState({ left: 100 });
  const {currentUser} = useUserContext()


  const currentDate = moment().format('D.M. YYYY');

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate random left and top values within the parent container
      const parentWidth = 200; // Width of the parent container
    //  const parentHeight = 1; // Height of the parent container

      const randomLeft = Math.floor(Math.random() * (parentWidth - 20)); // Subtracting 20 to ensure it stays within the container
      //const randomTop = Math.floor(Math.random() * (parentHeight - 20)); // Subtracting 20 to ensure it stays within the container

      setPosition({ left: randomLeft});
    }, 3500);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once



  return (
     <main className="w-screen">
       <Navbar/>

       <div className='mt-24  flex flex-col jutify-center items-center'>
 
        <div className='  relative md:ml-0 ml-6 h-[70px] text-base  overflow-hidden '>
          <div
              className='absolute'
              style={{ left: 100+`${position.left}px`, marginLeft:'50px'}}
            >
            <div className='w-[240px] italix font-bold'> Today is {currentDate} </div> 
          </div>
        </div>
          <div className='mt-2'>
          {currentUser?.role === 'Student' ? 
        <ChatBox/>
          :null
    }
            {currentUser?.role === 'Teacher' ? 
        <ChooseChatBox/>
        :null
  }
        </div>
        </div>
{/*         <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'blue',
                fontSize:'12px'
              },
            },
            error: {
              style: {
                background: 'red',
                fontSize:'12px'
              },
            },
          }}
        /> */}
      </main>

  )
}
