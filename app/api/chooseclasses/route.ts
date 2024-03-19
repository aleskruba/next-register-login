"use server"
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {

    const session = await getServerSession();
  
    if (session) {
      const currentUserTeacher = await prisma.teacher.findUnique({
        where: {
          email: session.user?.email as string, // Ensure session.user.email exists and is a string
        },
      });

      if (!currentUserTeacher) {
        return new Response(JSON.stringify({ message: 'User not found' }));
    }

    if (currentUserTeacher.email === session.user?.email) {

  try {

        const classes = await prisma.class.findMany({
            where: {
                teacherClassesIds: {
                    has: currentUserTeacher?.id
                    }
             },
          include: {
            teacherClasses: true, // Include the associated teachers
            studentClasses:true,
          },
        });

        
        return new Response(JSON.stringify({ data:classes }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
      }

    } return new Response(JSON.stringify({ message: 'Unathorized' }));
    
  } return new Response(JSON.stringify({ message: 'Unathorized' }));
}
