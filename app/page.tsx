'use client'

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar'
import moment from 'moment'

export default function Home() {

  const [position, setPosition] = useState({ left: 0, top: 0 });

  const currentDate = moment().format('D.M. YYYY');

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate random left and top values within the parent container
      const parentWidth = 150; // Width of the parent container
      const parentHeight = 350; // Height of the parent container

      const randomLeft = Math.floor(Math.random() * (parentWidth - 20)); // Subtracting 20 to ensure it stays within the container
      const randomTop = Math.floor(Math.random() * (parentHeight - 20)); // Subtracting 20 to ensure it stays within the container

      setPosition({ left: randomLeft, top: randomTop });
    }, 3500);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once


  return (
     <main className="w-full text-base">
       <Navbar/>
       <div className='mt-20 '>
        
        <div className='relative md:ml-0 ml-6 mt-40 w-[350px] h-[350px]  overflow-hidden'>
        <div
            className='absolute'
            style={{ left: `${position.left}px`, top: `${position.top}px` }}
          >
           <div className='w-[240px] italix font-bold'> Today is {currentDate} </div> 
          </div>
        </div>

       </div>


        
      </main>

  )
}
