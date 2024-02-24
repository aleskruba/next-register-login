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
      console.log(currentUser?.role)     
 
      if(currentUser?.role === 'Admin') {
   
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
          console.log('Student can be deleted');
                  const deletedStudent = await prisma.student.delete({
            where: { id: studentID },
          });
        
          return NextResponse.json({ message: 'success'}, { status: 200 });
        } else {
        
          console.log('Class is not empty');
          return new Response(JSON.stringify({ message: 'unauthorized' }));
        }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}

