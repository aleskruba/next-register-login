import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';



export async function POST(req: NextRequest) {
  const data = await req.json();

  const Pusher = require("pusher");

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET ,
    cluster: 'eu',
    useTls:true,
  
  })


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
                value:data.value,
         
              },
            });

            pusher.trigger(data.StudentID, 'new-grade', {
              gradeses:{
                  id:newGrade.id,
                  value:data.value,
                  comment:data.comment,
                  createdAt:new Date(),
                  updatedAt:new Date()
                  
              }
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

            await prisma.teacher.update({
              where: {
                id: currentUserTeacher.id,
              },
              data: {
                gradesIds: {
                  // Add the newGrade ID to the existing gradesIds array
                  push: newGrade.id,
                },
              },
            });
  
        
  
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



  export async function DELETE(req: NextRequest) {

    const data = await req.json();
    console.log('data.gradeID',data.gradeID,'data.studentID',data.studentID);

    const Pusher = require("pusher");

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID ,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
      secret: process.env.PUSHER_SECRET ,
      cluster: 'eu',
      useTls:true,
    
    })

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
  
         
               const deleteGrade = await prisma.grade.delete({
              where: { id: data.gradeID},
            });  
       
            const student = await prisma.student.findUnique({
              where: { id: data.studentID },
            });
            
            
            if (student) {
              const updatedGradesIds = student.gradesIds?.filter((id: any) => id !== data.gradeID) || [];
            
              const updateStudent = await prisma.student.update({
                where: { id: data.studentID },
                data: {
                  gradesIds: {
                    set: updatedGradesIds,
                  },
                },
              });
          
              pusher.trigger(data.studentID, 'delete-grade', {deleteGrade }); 
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


  export async function PUT(req: NextRequest) {

    const data = await req.json();

         

    const Pusher = require("pusher");

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID ,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
      secret: process.env.PUSHER_SECRET ,
      cluster: 'eu',
      useTls:true,
    
    })

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
     
            const updateGrade = await prisma.grade.update({
              where: { id: data.gradeID },
              data: {
                comment: data.comment,
                value: data.value,
                updatedAt: new Date(), // Assuming you want to update the 'updatedAt' field to the current date
              },
            });
      
            pusher.trigger(data.StudentID, 'udpated-grade', {
              gradeses:{
                  id:data.gradeID,
                  value:data.value,
                  comment:data.comment,
                  updatedAt:new Date()
                  
              }
            }); 
  
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