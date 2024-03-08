import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

  

        const existingClass = await prisma.class.findFirst({
      where: {
        classCode: data.classCode,
      },
    });
    if (existingClass) {
      // If classCode already exists, return an error response
      return NextResponse.json({ message: 'failed'});
    }
    // Save data to MongoDB using Prisma
    const newClass = await prisma.class.create({
      data: {
        classCode: data.classCode,
        language: data.language,
        schedule: data.schedule,
        teacherClasses: {
          connect: {
            id: data.teacherID, // Assuming teacherID is provided in the request
          },
        },
      },
      include: {
        teacherClasses: true, // Include the associated teacher data
      },
    });

 
    return NextResponse.json({ message: 'success', newClass }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  
  try {
    const classID = await req.json();

     const classToBeDeleted = await prisma.class.findUnique({
      where: { id: classID }, 
    });

    const teacherID =  classToBeDeleted?.teacherClassesIds[0]

  /*   const teacherClasstoBeDeleted = await prisma.teacher.findUnique({
      where: { id: teacherID }, 
    }); */

    if (!classToBeDeleted) {
         return NextResponse.json({ error: 'Admin record not found' }, { status: 400 });
    }

     if (classToBeDeleted.studentClassesIds.length === 0) {
      const deletedAdmin = await prisma.class.delete({
      where: { id: classID },
      });
    
      const updateTeacher = await prisma.teacher.update({
        where: { id: teacherID},
        data: {
          classesIds: {
            set: [],
          },
          gradesIds: {
            set: [],
          },
        },
      }
      
      );

      
    
    } 
    else {
      return NextResponse.json({ message: 'Class is not empty'}, { status: 401 });
    }
    return NextResponse.json({ message: 'success'}, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}



export async function PUT(req: NextRequest) {
  try {
    const classObject = await req.json();

    console.log(classObject)

    const existingClass = await prisma.class.findUnique({
      where: { id: classObject.id },
    });

    if (!existingClass) {
    
      return new Response(JSON.stringify({ message: 'Class not found' }), { status: 404 });
    }

    const updatedClass = await prisma.class.update({
      where: { id: classObject.id },
      data: {
        classCode: classObject.classCode,
        language: classObject.language,
        schedule: classObject.schedule,

        teacherClasses: {
          set: [{ id: classObject.teacherID}],
        },
      },
    });

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close the Prisma client connection
  }
}