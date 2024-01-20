"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import {  signIn } from "next-auth/react"
import { useUserContext } from "../context/auth-context";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  


  import { Button } from "@/components/ui/button"
import {  useState } from "react"
import { fetchCurrentUser } from "@/utils"
 
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(25),
  })  

  const Login = () => {
    const router = useRouter()
    const [error, setError] = useState("");
    const {setCurrentUser} = useUserContext()
    const [pending,setPending] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

 
    const handleSubmit = async (values:z.infer<typeof formSchema>) => {
      

        const email = values.email
        const password = values.password 
      try {
        setPending(true)

        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.ok) {
        const response = await fetchCurrentUser(email);
                     
        setCurrentUser(response);
        toast.success('Logged in successfully');
        setPending(false)
        router.replace("/");

          }

        if (res?.error) {
          setError("Invalid email or password");
    
        } else {
          setError("");
        }
      
      }catch(err) {
        console.log(err);
      }
    } 


  return (

    <div className="w-[70%] md:w-[60%] flex flex-col gap-4 justify-center h-screen">
      <h1 className="text-2xl md:text-3xl text-center  mb-4">Log in</h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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

<div className='text-xl text-red-500'>{error && error}</div>

<div className="flex flex-col gap-4 justify-center mt-4 ">

            <Button type="submit" 
                            className="w-full
                                      hover:bg-blue-400
                            "
                            disabled={pending}
                            >
                            Login {pending && '...'}
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

  </div>
  )

}

export default Login