"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

 
    const handleSubmit = (values:z.infer<typeof formSchema>) => {
        console.log(values);
    }


  return (
    <div className="w-[70%] md:w-[60%] flex flex-col gap-4">
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

            <div className="flex justify-center mt-4 ">
                    <Button type="submit" className="w-full">
                            Login
                    </Button>
                </div>
            </form> 
        </Form>

  </div>
  )
}

export default Login