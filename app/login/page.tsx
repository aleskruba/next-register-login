"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"

import { useRouter } from 'next/navigation'
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
 
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(25),
  })  

  const Login = () => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

 
    const handleSubmit = async (values:z.infer<typeof formSchema>) => {
        console.log(values);
        const dataResponse = await fetch('/api/testpost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify(values),
        });
      
        return dataResponse;
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

<div className="flex flex-col gap-4 justify-center mt-4 ">

            <Button type="submit" 
                            className="w-full
                                      hover:bg-blue-400
                            ">
                            Login
                    </Button>
                    <Button type='button' 
                            onClick={() => router.push('/')} 
                            className="w-full
                                       bg-gray-400
                                       hover:bg-gray-600
                                       hover:text-white
                                       "
        
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