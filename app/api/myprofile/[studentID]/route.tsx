import { NextResponse,NextRequest } from "next/server";
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';


export async function GET(req: Request,context:any) {
const {params} = context;
const session = await getServerSession();


try {
    

    if (session) {
      const currentUser = await prisma.student.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

 
      if(currentUser?.role == 'Student')    {
   
        const student = await prisma.student.findFirst({
            where: { id:params.studentID },
            include: {
              classes: true,  // Include the related classes
              gradeses: true, // Include the related grades
          },
        });

        return new Response(JSON.stringify({ data:student }), { status: 200 });

        }


    } else 
        { return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });}

return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });


}
catch(err){
    console.log(err)
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
}
}



export async function PUT(req: NextRequest) {
  
  try {
    const student = await req.json();

    const existingStudent= await prisma.student.findUnique({
      where: { id: student.id },
    });

    if (!existingStudent) {
    
      return new Response(JSON.stringify({ message: 'Student not found' }), { status: 404 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: {
        email: student.email,
        f_name: student.f_name,
        l_name: student.l_name,
          },
    });

    return NextResponse.json({ message: 'success'}, { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}