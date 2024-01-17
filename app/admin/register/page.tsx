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
    f_name: z.string().min(3).max(25),
    l_name: z.string().min(3).max(25),
    languages:z.string().min(3).max(50),
    password: z.string().min(3).max(25),
    confirm_password: z.string().min(3).max(25),
    role: z.enum(["Student","Teacher","Admin"])
  }).refine((data)=>{
    return data.password === data.confirm_password
  },{
    message :"Passwords do not match",
    path: ["confirm_password"]
  })

  

const Register = () => {
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
                              <Select onValueChange={field.onChange} required>                              <FormControl>
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

                {role === 'Teacher' &&
                <FormField control={form.control} 
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
                <div className="flex justify-center mt-4 ">
                    <Button type="submit" className="w-full">
                            Submit 
                    </Button>
                </div>
            </form> 
        </Form>

    </div>
  )
}

export default Register