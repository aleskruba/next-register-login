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

 
      if(currentUser?.role == 'Admin' || currentUserTeacher?.role == 'Teacher' || currentUserStudent?.role == 'Student')    {
   
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


export async function DELETE(req: NextRequest) {
  
  try {
    const studentID = await req.json();

    const classes = await prisma.class.findMany()
   

     const studentToBeDeleted = await prisma.student.findUnique({
      where: { id: studentID }, 
    });
    if (!studentToBeDeleted) {
         return NextResponse.json({ error: 'Admin record not found' }, { status: 400 });
    }

    const studentClassesIds = classes.flatMap(cls => cls.studentClassesIds);
        if (!studentClassesIds.includes(studentID)) {
     
                  const deletedStudent = await prisma.student.delete({
            where: { id: studentID },
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

  const session = await getServerSession();
  const student = await req.json();

  try {

    if (session) {
      const currentUser = await prisma.admin.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      const currentUserStudent = await prisma.student.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });
  
      if(currentUser?.role == 'Admin' || currentUserStudent?.id == student.id)    {


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
    } else {return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });}
  } 
  
  else  { return new Response(JSON.stringify({ message:'not authorized' }), { status: 401 });}
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}