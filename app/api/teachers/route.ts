"use server"
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

 

    if (session) {
      const currentUser = await prisma.admin.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      if (currentUser?.role == 'Admin') {

        const teachers = await prisma.teacher.findMany();
 
        return new Response(JSON.stringify({ data:teachers }), { status: 200 });
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