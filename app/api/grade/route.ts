import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';




export async function POST(req: NextRequest) {
    try {
      const session = await getServerSession();
  
      if (session) {
        const currentUserTeacher = await prisma.teacher.findUnique({
          where: {
            email: session.user?.email as string, // Ensure session.user.email exists and is a string
          },
        });
  
        if (currentUserTeacher?.role === 'Teacher') {
          try {
            const data = await req.json();
            console.log(data);
  
            const student = await prisma.student.findUnique({
              where: {
                id: data.StudentID,
              },
            });
  
            if (!student) {
              throw new Error('Student not found');
            }
  
            // Create a new grade instance
            const newGrade = await prisma.grade.create({
              data: {
                comment: data.comment,
                value: data.value,
                // ... other grade fields
              },
            });
  
            // Establish the relationship between student and grade
            await prisma.student.update({
              where: {
                id: student.id,
              },
              data: {
                gradesIds: {
                  // Add the newGrade ID to the existing gradesIds array
                  push: newGrade.id,
                },
              },
            });
  
            console.log(data);
  
            return new NextResponse(JSON.stringify({ data: 'success' }), { status: 200 });
          } catch (error) {
            console.error(error);
            return new NextResponse(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
          }
        } else {
          return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }
      } else {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
    } catch (error) {
      console.error(error);
      return new NextResponse(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
    }
  }