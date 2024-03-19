import { NextResponse,NextRequest } from "next/server";
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';


export async function GET(req: Request,context:any) {
const {params} = context;
const session = await getServerSession();

try {
    

    if (session) {
      const currentUser = await prisma.teacher.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      if (!currentUser) {
        return new Response(JSON.stringify({ message: 'User not found' }));
    }
      if(currentUser?.role == 'Teacher' && currentUser.id == params.teacherID)    {
   
        const teacher = await prisma.teacher.findFirst({
            where: { id:params.teacherID },
            include: {
              classes: true,  // Include the related classes
              gradeses: true, // Include the related grades
          },
        });

        return new Response(JSON.stringify({ data:teacher }), { status: 200 });

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
 
    const teacher = await req.json();
    const session = await getServerSession();

    try {

        if (session) {
            const currentUser = await prisma.teacher.findUnique({
              where: {
                email: session.user?.email as string // Ensure session.user.email exists and is a string
              }
            });
      
       
       
            if(currentUser?.role == 'Teacher' && currentUser.id == teacher.id)    {
 

    const existingTeacher= await prisma.teacher.findUnique({
      where: { id: teacher.id },
    });

    if (!existingTeacher) {
    
      return new Response(JSON.stringify({ message: 'Teacher not found' }), { status: 404 });
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        email: teacher.email,
        f_name: teacher.f_name,
        l_name: teacher.l_name,
          },
    });

    return NextResponse.json({ message: 'success'}, { status: 200 });

}
    } else 
    { return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });}

return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });


  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}