"use server"
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {

        const classes = await prisma.class.findMany({
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
}





export async function PUT(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession();
  

  try {

    if (session) {
      const currentUser = await prisma.admin.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });


    for (const classData of data) {
      const { id: classId, studentClassesIds } = classData;

      const originalClass = await prisma.class.findUnique({
        where: { id: classId }
      });

      console.log('originalClass',originalClass?.studentClassesIds)
      console.log('studentClassesIds',studentClassesIds)
    
      const studentsToUpdate = originalClass?.studentClassesIds?.filter((studentId: any) => !studentClassesIds.includes(studentId));
     
      if (studentsToUpdate) {  
      await Promise.all(
        studentsToUpdate.map(async studentId => {
          await prisma.student.update({
            where: { id: studentId },
            data: {
              classesIds: [],
              gradesIds: [],
            },
            
          });
        })
      );

      }
      // Update the studentClassesIds array for the existing class
      await prisma.class.update({
        where: { id: classId },
        data: {
          studentClassesIds: { set: studentClassesIds },
        },
      });



      // Find students and add classId to their classesIds
      for (const studentId of studentClassesIds) {
        // Fetch existing student data
        const existingStudent = await prisma.student.findUnique({
          where: { id: studentId },
        });

        if (existingStudent) {
          // Check if classId is not already in classesIds
          if (!existingStudent.classesIds.includes(classId)) {
            // Update student data by pushing classId
            await prisma.student.update({
              where: { id: studentId },
              data: {
                classesIds: { push: classId },
              },
            });
          }
        }
      }
    }

/*     for (const classData of data) {
      console.log(`Class ID: ${classData.id}, Student Classes IDs: ${classData.studentClassesIds}`);
    } */


    const students = await prisma.student.findMany();

    const allClassesIds = [].concat(...data.map((classObj: { ids: any; }) => classObj.ids));

    const studentsClassesIds = []


    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });

  }
  else {  return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });}
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
