import React,{ ChangeEvent, FormEvent, useEffect, useState} from 'react';
import { useTheme } from "next-themes"
import { useUserContext } from "../../context/auth-context";
import { deleteMessage, fetchMessages, sendMessage } from '@/utils';
import { PostArray } from '@/types';
import moment from 'moment';
import { AiFillDelete} from 'react-icons/ai';
import { useRouter } from 'next/navigation'

function ChatBox() {
    
    const router = useRouter()
    const {currentUser} = useUserContext()
    const [emptyInputError,setEmptyInputError] = useState(false)
    const { resolvedTheme } = useTheme();
    const [messages,setMessages] = useState<PostArray>([])
    const [isLoading,setIsLoading] = useState(true)
    const [isDeletingMessage,setIsDeletingMessage] = useState(false)
    const [updated,setUpdated] = useState(false)
    const [newMessage, setNewMessage] = useState({
      id: '' ,
      message: '',
      createdAt: new Date(),
      role: '',
      classCodesIds: '',
      authorStudentId: currentUser?.id || undefined,
      authorStudent: undefined,
      authorTeacherId: '',  
      authorTeacher: undefined,
    });
    



    useEffect(() => {
      console.log(currentUser?.classesIds?.[0]);
      try {
      const fetchData = async () => {
          const response = await fetchMessages()
           console.log(response)
           setMessages(response)
           setIsLoading(false)
        }
      fetchData()
      } catch(err)
      {console.log(err)}

     },[updated])

   

     function generateRandomString(length:any) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
  }
  const randomString = generateRandomString(8);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { 
      setNewMessage({...newMessage,[e.target.name]:e.target.value,   id: randomString, createdAt: new Date()})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      if (newMessage.message) {
      try {
        const response = await sendMessage(newMessage)
        setMessages([...messages,  newMessage]);

        setNewMessage({...newMessage, message:''})

        if (response.message === 'empty') {
        
          setEmptyInputError(true)
        }
        if (response.message ==='success') {
   
          setEmptyInputError(false)
          setUpdated(!updated)
        }
       }
      catch (e) {
        console.log(e)
      }
    }
      else { console.log('cannot be empty')
              setEmptyInputError(true) }
    }


    const deleteMessageFunction = (id:string) =>{

      const isConfirmed = window.confirm("Are you sure you want to delete this message?");

      if (isConfirmed) {
     
    
      const data = {  messageID:id,}

      setIsDeletingMessage(true);
      try{
        const fetchFunction = async () =>{
          const response =  await deleteMessage(data);
    
          if (response.data === 'success') {
                 setUpdated(!updated)
                 router.refresh()
                 await new Promise(resolve => setTimeout(resolve, 1000));
                 setIsDeletingMessage(false) 
          }
        }
        fetchFunction()
      } catch(err) {
        console.log(err)
        setIsDeletingMessage(false)
    
      }
    }

    }

  return ( <>
    {messages && messages.length > 0 && <>
    <div>
        {!isLoading ? 
      <div className={`${resolvedTheme === 'dark' ? 'bg-gray-500' : 'bg-gray-200'} shadow-lg rounded-lg p-4 w-[380px] md:w-[580px] lg:w-[780px] `}>

     
        <div className="space-y-4">

        {messages?.map(message => {
            if (message.role === 'teacher') {
                return (
                    <div className='flex justify-end items-center gap-2' key={message.id}>
                        <div className="flex justify-end">
                            <img src={message?.authorTeacher?.image ?? ""} className="w-10 h-10 rounded-full" alt='profile image'/>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className={`bg-green-100 rounded-lg py-2 px-4 max-w-xl ${resolvedTheme === 'dark' ? 'text-gray-600' : 'text-black'}`} key={message.id}>
                                <p className='text-xs font-bold'>{message?.authorTeacher?.f_name} {message?.authorTeacher?.l_name}  <span className='font-thin'>wrote on</span> {moment(message.createdAt).format('DD.MM. [at] hh:mm A')} </p>
                                <p className="text-sm">{message.message}</p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className='flex items-center gap-2' key={message.id}>
                        <div className="flex justify-start min-w-12 ">
                      
                            <img src={message?.authorStudent?.image ? message.authorStudent.image : currentUser?.image || './placeholder.jpg'}
                                          className="w-10 h-10 rounded-full"  alt='profile image'/>
                  
                           </div>
                        <div className="flex flex-col items-center ">
                            <div className={`bg-gray-300  rounded-lg py-2 px-4 max-w-xl ${resolvedTheme === 'dark' ? ' text-gray-800' : 'text-black'} `} key={message.id}>
                                <p className='text-xs font-bold'>
                                {message?.authorStudent ? <>
                                    {message?.authorStudent?.f_name} {message?.authorStudent?.l_name  }
                                     </>
                               : 
                               <>
                              {currentUser?.f_name} {currentUser?.l_name}
                               </>
                               }  
                              
                                                              
                                 <span className='font-thin'>wrote on</span>{moment(message.createdAt).format('DD.MM. [at] hh:mm A')} </p>
                                <p className="text-sm ">{message.message}</p>
                            </div>
                        </div>
                  
                        {!isDeletingMessage && (
                            <div className='w-[25px] flex justify-center cursor-pointer' onClick={() => deleteMessageFunction(message.id)}>
                                <AiFillDelete className="text-xl text-red-500 hover:text-red-400" />
                            </div>
                        )}
                        {isDeletingMessage && (
                            <div className='w-[25px] flex justify-center cursor-default opacity-20'>
                                <AiFillDelete className="text-xl text-red-500 " />
                            </div>
                        )}
                    </div>
                );
            }
        })}


        </div>

        <form action="" onSubmit={handleSubmit}>
        <div className="flex mt-4 h-10">

           <input type="text" 
                  placeholder="Type a message..." 
                  className="flex-grow rounded-full py-2 px-2 lg:px-4 focus:outline-none focus:ring focus:border-blue-300" 
                  name = "message"
                  value={newMessage.message}
                  onChange={handleChange}  
                  />
  <button 
    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-2 lg:px-4 py-2 lg:ml-2 focus:outline-none focus:ring focus:border-blue-300 flex items-center" 
    type='submit' 
   >Send</button>

        </div>
        <div className="text-red-500 text-base">{emptyInputError && 'Cannot be empty'}</div> 
        </form>

  
      </div>

: <>
  <div className='w-screen h-screen flex justify-center '>
              <img src="/spinner.svg" alt="" className="w-[100px] "/>
            </div>
        
</>}
    </div>

    </>
  }
  </>
  )


        

}



export default ChatBox;
