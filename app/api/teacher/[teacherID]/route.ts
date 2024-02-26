import { NextResponse,NextRequest } from "next/server";
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';


export async function GET(req: Request,context:any) {
const {params} = context;
const session = await getServerSession();

try {
    

    if (session) {
      const currentUser = await prisma.admin.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });
     
      if(currentUser?.role === 'Admin') {
   
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


export async function DELETE(req: NextRequest) {
  
  try {
    const teacherID = await req.json();

    const classes = await prisma.class.findMany()
   

     const teacherToBeDeleted = await prisma.teacher.findUnique({
      where: { id: teacherID }, 
    });
    if (!teacherToBeDeleted) {
         return NextResponse.json({ error: 'Admin record not found' }, { status: 400 });
    }

    const teacherClassesIds = classes.flatMap(cls => cls.teacherClassesIds);
        if (!teacherClassesIds.includes(teacherID)) {
         
                  const deletedTeacher = await prisma.teacher.delete({
            where: { id: teacherID },
          });
        
          return NextResponse.json({ message: 'success'}, { status: 200 });
        } else {
        
                return new Response(JSON.stringify({ message: 'unauthorized' }));
        }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  
  try {
    const teacher = await req.json();

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

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}