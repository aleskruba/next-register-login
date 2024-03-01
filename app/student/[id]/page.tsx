"use client"
import Navbar from "@/app/components/Navbar";
import { useRouter } from 'next/navigation'
import { FC,useEffect,useState} from "react";
import MyProfileComponent from "@/app/components/MyProfileComponent";
import { useUserContext } from "../../../context/auth-context";


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

      {isLoading ? <>wait please .... </> : <> 
        <MyProfileComponent id={params.id}/>
      </>}

       </div>

  )
}
 
export default Post;