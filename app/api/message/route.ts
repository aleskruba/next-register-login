import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
    
    const session = await getServerSession();
    const data = await req.json();
    console.log(data);

    if (!data.message){
      return new Response(JSON.stringify({ message:'empty' }))

    } 
     else {

  try {
    if (session) {
        const currentUserStudent = await prisma.student.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });

        const currentUserTeacher = await prisma.teacher.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });

        
        if (currentUserStudent && currentUserStudent?.id == data.senderID){

                  const classId = await prisma.class.findFirst({
                    where: {
                        studentClassesIds: {
                            has: currentUserStudent?.id
                        }
                    }
                });
        
                console.log('Student wrote',data , 'CLASS',classId?.classCode)
       
            return NextResponse.json({ message: 'success'});
          }

        if (currentUserTeacher && currentUserTeacher?.id == data.senderID){

          const classId = await prisma.class.findFirst({
            where: {
                studentClassesIds: {
                    has: currentUserStudent?.id
                }
            }
        });
          

          console.log('Teacher wrote',data , 'CLASS',classId?.classCode)
              
         return NextResponse.json({ message: 'success'});
      }


    } else  { 
        return new Response(JSON.stringify({ message:'not authorized' }))
        ;}
} catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
 
}

}