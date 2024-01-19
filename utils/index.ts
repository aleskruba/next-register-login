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

  import * as z from "zod"

  
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