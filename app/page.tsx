'use client'

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar'
import moment from 'moment'
import ChatBox from './components/ChatBox';
import { useUserContext } from "../context/auth-context";
import ChooseChatBox from './components/ChooseChatBox';
import toast, { Toaster } from 'react-hot-toast';
import InfoPage from './components/InfoPage';

export default function Home() {

  const [position, setPosition] = useState({ left: 100 });
  const {currentUser,session} = useUserContext()


  const currentDate = moment().format('D.M. YYYY');



  return (
     <main className="w-screen">
       <Navbar/>

       <div className='mt-24  flex flex-col jutify-center items-center'>
 
        <div className='  relative md:ml-0 ml-6 h-[70px] text-base  overflow-hidden '>
          <div>
            <div className='w-[240px] italix font-bold'> Today is {currentDate} </div> 
          </div>
        </div>
          <div className='mt-2'>
            {!session && 
            <div className='text-base font thin'>
              <InfoPage/>
            </div>
            }
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

      </main>

  )
}
