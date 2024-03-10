"use client"
import Navbar from "@/app/components/Navbar";
import { useRouter } from 'next/navigation'
import { FC,useEffect,useState} from "react";
import { useUserContext } from "../../../context/auth-context";
import { MyGradesStudent } from "@/app/components/MyGradesStudent";


interface Props {
     params: 
     { id: string }
}
    

 
const Post: FC<Props> = ({params}) => {

  const {session,currentUser} = useUserContext()
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    if (session && currentUser?.role === "Student" && currentUser?.id ===params.id ) {
    setIsLoading(false)
    }
    else {
      router.replace("/");
    }
  },[])

  const router = useRouter()


    return (    
    <div className="mt-20 flex justify-center ">
      <Navbar/>

      {isLoading ? <>      
          <div className='w-screen h-screen flex justify-center items-center '>
              <img src="/spinner.svg" alt="" className="w-[100px]"/>
            </div></> : <> 
        <MyGradesStudent id={params.id}/>
      </>}

       </div>

  )
}
 
export default Post;