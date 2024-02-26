"use client"

import { useRef,useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { languages } from '@/constants'
import { useUserContext } from "../../../context/auth-context";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import { Button } from "@/components/ui/button"
import { createUser } from '@/utils'
 
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


const Register = () => {
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)

const [pending,setPending] = useState(false)
const {session,currentUser} = useUserContext()
const [isLoading,setIsLoading] = useState(true)

useEffect(() => {
  if (session && currentUser?.role === "Admin") {
  setIsLoading(false)
  }
  else {
    router.replace("/");
  }
},[])


const [error,setError] = useState('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
          email: "",
          f_name:"",
          l_name:"",
          languages:"",
          password: "",
          confirm_password: "",
          role: "Student" || "Teacher" || "Admin"
     
        },
      })

      const role = form.watch('role')

      const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setPending(true)
        try {
          console.log(values);
          setError('');
      
           await createUser(values);
      
          toast.success('Registered successfully');
          await form.reset();
          setPending(false)
      
        } catch (error) {
          console.error('Error in form submission:', error);
          setPending(false)
      
          if (error instanceof Response && error.status === 422) {
            setError(error.statusText);
            setPending(false)
          } else {
            // Handle other error cases
            toast.error('Something went wrong');
            setPending(false)
          }
        }
      };
  return (
    <div className="w-[70%] md:w-[60%] flex flex-col gap-4">
      {isLoading ? <>...wait please </> : <> 
      <h1 className="text-2xl md:text-3xl text-center mt-4 mb-4">Register a new user</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}
              ref={ref}>
                <FormField control={form.control} 
                           name="email" 
                           render={({ field })=>(
                            <FormItem>
                             <FormLabel>Email</FormLabel>
                              <FormControl>
                                  <Input placeholder="Email address" 
                                        autoComplete="Email"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} />
                
                <FormField control={form.control} 
                           name="f_name" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>First name</FormLabel>
                              <FormControl>
                                  <Input placeholder="First name" 
                                        autoComplete="f_name"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} />


                <FormField control={form.control} 
                           name="l_name" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>Last name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Last name" 
                                  autoComplete="l_name"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} />

                <FormField control={form.control} 
                           name="role" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} >                              <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Teacher">Teacher</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                          </Select>                      
                              <FormMessage />
                      
                           </FormItem>
                           )} />

          
           {/*      <FormField control={form.control} 
                           name="languages" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>Teaching Languages</FormLabel>
                              <FormControl>
                                  <Input placeholder="Teaching Languages" 
                                  autoComplete="Teaching Languages"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} /> */}
                           
      {role === 'Teacher' &&
                  <FormField control={form.control} 
                  name="languages" 
                  render={({ field })=>(
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} >                        
                    <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  </FormControl>
                  <SelectContent> 
                    {languages.map(language =>( 
                      <div key={language}>
                      <SelectItem value={language}>{language}</SelectItem>
            
                      </div>
                    ))}
                   
                      </SelectContent>
                </Select>                      
                    <FormMessage />
            
                  </FormItem>
          )} />        
                  }
                <FormField control={form.control} 
                           name="password" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                  <Input placeholder="Password" 
                                  autoComplete="password"
                                         type="password"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} />

                <FormField control={form.control} 
                           name="confirm_password" 
                           render={({ field })=>(
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                      
                              <FormControl>
                                  <Input placeholder="Confirm Password" 
                                  autoComplete="confirm_password"
                                         type="password"
                                         {...field} />
                             </FormControl>
                              <FormMessage />
                           </FormItem>
                           )} />
               <div className='text-xl text-red-500'>{error && error}</div>
               
                <div className="flex flex-col gap-4 justify-center mt-4 ">
                    <Button type="submit" 
                            className="w-full
                                      hover:bg-blue-400
                            "
                            disabled={pending}
                            >
                            Submit {pending && '...'}
                    </Button>
                    <Button type='button' 
                            onClick={() => router.push('/')} 
                            className="w-full
                                       bg-gray-400
                                       hover:bg-gray-600
                                       hover:text-white
                                       "
                                       disabled={pending}
                            >
                            Back
                    </Button>
                 
                </div>
            </form> 
        </Form>
        </>}
    </div>
  )
}

export default Register