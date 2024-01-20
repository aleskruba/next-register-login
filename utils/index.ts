
  import * as z from "zod"
import { UserProps } from "@/types";
  


  const formSchema = z.object({
    email: z.string().email(),
    f_name: z.string().min(3).max(25),
    l_name: z.string().min(3).max(25),
    languages:z.string().optional(),
    password: z.string().min(3).max(25),
    confirm_password: z.string().min(3).max(25),
    role: z.enum(["Student","Teacher","Admin"]),

  }).refine((data)=>{
    return data.password === data.confirm_password
  },{
    message :"Passwords do not match",
    path: ["confirm_password"]
  })
  
export async function createUser(user:z.infer<typeof formSchema>){
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
 
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const responseData = await response.json();

    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error logic here, set error state, show a notification, etc.
    }
  }

  export async function fetchCurrentUser(user: string): Promise<UserProps> {
    try {
      const response = await fetch('/api/currentuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const responseData = await response.json();
      return responseData.data; // Return the parsed data
  
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error logic here, set error state, show a notification, etc.
      throw error; // Re-throw the error to be caught in the calling code
    }
  }
  