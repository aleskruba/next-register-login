import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function PUT(req: NextRequest) {
    try {
      const session = await getServerSession();

      if (session) {
        const currentUserAdmin = await prisma.admin.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });
  
        const currentUserTeacher = await prisma.teacher.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });
  
        const currentUserStudent = await prisma.student.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });
  
   
        if(currentUserAdmin?.role == 'Admin' || currentUserTeacher?.role == 'Teacher' || currentUserStudent?.role == 'Student')    {
          try {
            const data = await req.json();
       
                console.log(data);

             if (currentUserStudent) {   
       
              const updateGrade = await prisma.student.update({
              where: { id: currentUserStudent.id },
              data: { image:data.imageUrl}
             
            });
        }

        if (currentUserTeacher) {   
       
          const updateGrade = await prisma.teacher.update({
          where: { id: currentUserTeacher.id },
          data: { image:data.imageUrl}
         
        });
    }

        if (currentUserAdmin) {   

          if (data.role == "Student") {
          const currentUser = await prisma.student.findUnique({
            where: {
              id: data.userID as string // Ensure session.user.email exists and is a string
            }
          });
    
          const updateGrade = await prisma.student.update({
          where: { id: currentUser?.id },
          data: { image:data.imageUrl}
        
        });
    }
    
        if (data.role == "Teacher") {
          const currentUser = await prisma.teacher.findUnique({
            where: {
              id: data.userID as string // Ensure session.user.email exists and is a string
            }
          });

            const updateGrade = await prisma.teacher.update({
            where: { id: currentUser?.id },
            data: { image:data.imageUrl}
          
          });
      } 
    
  
  
  }
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