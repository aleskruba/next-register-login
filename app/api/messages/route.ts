"use server"
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();



    if (session) {
      const currentUser = await prisma.student.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      const classId = await prisma.class.findFirst({
        where: {
            studentClassesIds: {
                has: currentUser?.id
            }
        }
      })

      const cuurentUserID = currentUser?.id

      if(cuurentUserID && classId?.studentClassesIds.includes(cuurentUserID))  {

 
                const messages = await prisma.message.findMany({
                     where: {
                        classCodesIds: classId?.id // Using optional chaining to access classCode safely
                    }, 
                    include: {
                        authorStudent: true,  
                        authorTeacher: true,  
                    },
                });
                
    
         console.log(messages)
        return new Response(JSON.stringify({ data:messages }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
    } else {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}