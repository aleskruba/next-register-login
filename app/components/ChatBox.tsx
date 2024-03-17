import React,{ ChangeEvent, FormEvent, useEffect, useState} from 'react';
import { useTheme } from "next-themes"
import { useUserContext } from "../../context/auth-context";
import { sendMessage } from '@/utils';

function ChatBox() {
    
    const {session,currentUser,setCurrentUser} = useUserContext()
    const [emptyInputError,setEmptyInputError] = useState(false)
    const { resolvedTheme } = useTheme();

    useEffect(() => {
    console.log(currentUser)
     },[])

   
    const [newMessage,setNewMessage] = useState({
      message:'',
      senderID:currentUser?.id,
  
    })


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { 
      setNewMessage({...newMessage,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log(newMessage);
      if (newMessage.message) {
      try {
        const response = await sendMessage(newMessage)
        console.log(response);

        if (response.message === 'empty') {
        
          setEmptyInputError(true)
        }
        if (response.message ==='success') {

          setEmptyInputError(false)
        }
       }
      catch (e) {
        console.log(e)
      }
    }
      else { console.log('cannot be empty')
              setEmptyInputError(true) }
    }

  return (
    <div>
      <div className={`${resolvedTheme === 'dark' ? 'bg-gray-500' : 'bg-gray-200'} shadow-lg rounded-lg p-4 w-[380px] md:w-[580px] lg:w-[780px] `}>

        <div className="space-y-4">

        <div className='flex justify-end items-center gap-2'>
          <div className="flex justify-end">
          <img src={currentUser?.image ?? ""} className="w-10 h-10 rounded-full" alt='profile image'/>


          </div>

          <div className="flex flex-col items-end">
            <div className={`bg-green-100 rounded-lg py-2 px-4 max-w-xs ${resolvedTheme === 'dark' ? 'text-gray-600' : 'text-black'}`}>
            <p className='text-xs font-bold'>Teacher <span className='font-thin'>wrote on</span> 24.3. at 10:00 AM </p>
              <p className="text-sm">Hello, how are you?</p>
       
            </div>
          </div>
      </div>

      <div className='flex items-center gap-2'>
          <div className="flex justify-start ">
          <img src={currentUser?.image ?? ""} className="w-10 h-10 rounded-full"  alt='profile image'/>


          </div>

          <div className="flex flex-col items-start">
            <div className={`bg-gray-200 rounded-lg py-2 px-4 max-w-xs ${resolvedTheme === 'dark' ? 'text-gray-600' : 'text-black'} `}>
              <p className='text-xs font-bold'>Peter <span className='font-thin'>wrote on</span> 24.3. at 10:00 AM </p>
              <p className="text-sm">Hi, I am good! What about you?</p>
       
            </div>
          </div>

        </div>
        </div>

        <form action="" onSubmit={handleSubmit}>
        <div className="flex mt-4">

           <input type="text" 
                  placeholder="Type a message..." 
                  className="flex-grow rounded-full py-2 px-2 lg:px-4 focus:outline-none focus:ring focus:border-blue-300" 
                  name = "message"
                  onChange={handleChange}  
                  />
          <input className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-2 lg:px-4 py-2 lg:ml-2 focus:outline-none focus:ring focus:border-blue-300"
                type= 'submit'
                value='Send'
          />

        </div>
        <div className="text-red-500 text-base">{emptyInputError && 'Cannot be empty'}</div> 
        </form>
      </div>
    </div>
  )
}

export default ChatBox;
