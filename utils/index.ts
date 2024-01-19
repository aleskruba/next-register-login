 type UserProps = {
    f_name: string;
    l_name: string;
    email: string;
    image?: string | null;
    hashedPassword?: string | null;
    languages?: string | null;
    role: string;
    createdAt?: Date ;
    updatedAt?: Date;
  };
import { formSchema } from "@/app/admin/register/page";
  import * as z from "zod"
  

export async function createUser(user:z.infer<typeof formSchema>){
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const responseData = await response.json();
      console.log(responseData); // Handle the response as needed
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error logic here, set error state, show a notification, etc.
    }
  }