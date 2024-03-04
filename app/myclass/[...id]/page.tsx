"use client"
import Navbar from "@/app/components/Navbar";
import { useRouter } from 'next/navigation'
import { FC,useEffect,useState} from "react";
import { useUserContext } from "../../../context/auth-context";
import MyClassTeacher from "@/app/components/MyClassTeacher";
import { MyClassTeacherStudentDetail } from "@/app/components/MyClassTeacherStudentDetail";


interface Props {
     params: 
     { id: string }
}
    

 
const Post: FC<Props> = ({params}) => {

  const {session,currentUser} = useUserContext()
  const [isLoading,setIsLoading] = useState(true)

   useEffect(() => {
    if (session && currentUser?.role === "Teacher" && currentUser?.id ===params.id[0] ) {
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



      {params.id.length == 1 &&   <MyClassTeacher id={params.id[0]}/>} 
      {params.id.length == 2 &&   <MyClassTeacherStudentDetail id={params.id[1]}  /> }

      </>}

       </div>

  )
}
 
export default Post;