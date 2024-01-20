import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';


export async function POST(req: NextRequest) {

        
        try {const data = await req.json();

            console.log(data)

               const email = data
       

                 const admin = await prisma.admin.findUnique({
                    where: { email },
                  });
        
                  if (admin) {
                                 return new Response(JSON.stringify({data:  admin }), { status: 200 });
                    }
              
        
                  // Check if the user exists in the student model
                  const student = await prisma.student.findUnique({
                    where: { email },
                  });
        
                  if (student) {
                                   return new Response(JSON.stringify({ data:student }), { status: 200 });
                    }
         
        
                  // Check if the user exists in the teacher model
                  const teacher = await prisma.teacher.findUnique({
                    where: { email },
                  });
        
                  if (teacher) {
                               return new Response(JSON.stringify({data: teacher }), { status: 200 });
                    } 
             
            }catch(error) {
            console.log(error)
            return new Response(JSON.stringify({message: 'Failed to process the message' }), { status: 500 });
         }


 
}
