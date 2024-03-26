"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import {  signIn } from "next-auth/react"
import { useUserContext } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
        toast('Logged in successfully', {
          style: {
            background: '#4CAF50', // Green background color
            color: '#FFFFFF', // White text color
            border: '1px solid #388E3C', // Dark green border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for depth
            fontSize: '12px', // Font size
            padding: '16px', // Padding
          },
        });
        setPending(false)
        router.replace("/");

          }

        if (res?.error) {
          setError("Invalid email or password");
          setPending(false)
    
        } else {
          setError("");
          setPending(false)
        }
      
      }catch(err) {
        console.log(err);
      }
    } 


  return (

    <div className="w-[70%] md:w-[60%] flex flex-col gap-4 justify-center h-screen">

      <div className="absolute w-[200px] h-[200px] bg-blue-300 text-gray-800 left-1 top-1 text-xs">
          <p>some students</p>
         <p>carmen@mexico.com  Heslo12345</p> 
         <p>cech@email.com  Heslo12345</p> 
         <p>pepa@seznam.cz  Heslo12345</p> 
       <br />
        <p>some teachers</p>
  
        <p>ales@ales.cz  Heslo12345</p> 
        <p>josef@email.com  Heslo12345</p> 
        <br />
        <p>admin</p>
        <p>reactbrno@centrum.cz  Heslo12345</p>
        

      </div>
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