import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log(data);

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

    console.log('Class saved:', newClass);

    return NextResponse.json({ message: 'success', newClass }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}
