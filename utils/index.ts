
  import * as z from "zod"
import { UserProps } from "@/types";
import { ClassProps } from "@/types";  


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
  

  export async function fetchStudents() {

    const response = await fetch(`/api/students`)
    const data = await response.json()

return data.data
}


export async function fetchTeachers() {

  const response = await fetch(`/api/teachers`)
  const data = await response.json()

return data.data
}


export async function createClass(classData: ClassProps): Promise<void> {
  try {
    const response = await fetch('/api/class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      throw new Error('Failed to create class');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error creating class:', error);

  }
}


export async function fetchClasses() {

  const response = await fetch(`/api/classes`)
  const data = await response.json()

return data.data
}
