"use client"
import { FC,useEffect } from "react";

interface Props {
     params: 
     { id: string }
}
    

 
const Post: FC<Props> = ({params}) => {
    
    useEffect(() =>{
        const fetchData = async () => { 
        const response = await fetch(`/api/student/${params.id}`)
        const data = await response.json()
        }
        fetchData()
    },[]);
    
    return ( <div>{params.id}</div> );
}
 
export default Post;