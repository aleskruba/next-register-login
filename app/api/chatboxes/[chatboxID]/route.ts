import { NextResponse,NextRequest } from "next/server";
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';


export async function GET(req: Request,context:any) {
const {params} = context;
const session = await getServerSession();

console.log(params.chatboxID)

try {

    const classId = await prisma.class.findFirst({
      where: {
        id:params.chatboxID
      }
    })

    if (!classId) {
      return new Response(JSON.stringify({ message: 'Class not found' }));
  }
     

    if (session && classId) {
      const currentUser = await prisma.teacher.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      if (!currentUser) {
        return new Response(JSON.stringify({ message: 'User not found' }));
    }

      const cuurentUserID = currentUser?.id

      if(cuurentUserID && classId?.teacherClassesIds.includes(cuurentUserID))    {
   
        const messages = await prisma.message.findMany({
          where: {
             classCodesIds: classId?.id // Using optional chaining to access classCode safely
         }, 
         include: {
          authorStudent: true,  
          authorTeacher: true,  
         },
     });

        return new Response(JSON.stringify({ data:messages }), { status: 200 });

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




export async function POST(req: NextRequest,context:any) {
  const Pusher = require("pusher");

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET ,
    cluster: 'eu',
    useTls:true,
  
  })

  const {params} = context;
  const session = await getServerSession();
  const data = await req.json();

console.log(data);
  if (!data.message){
    return new Response(JSON.stringify({ message:'empty' }))

  } 
   else {

try {
  if (session) {
      const currentUserTeacher = await prisma.teacher.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });
 
      if (!currentUserTeacher) {
        return new Response(JSON.stringify({ message: 'User not found' }));
    }

      const classId = await prisma.class.findFirst({
      where: {
        id:params.chatboxID
      }
       })

       if (!classId) {
        return new Response(JSON.stringify({ message: 'Class not found' }));
    }
      
      if (currentUserTeacher && currentUserTeacher?.id == data.authorTeacherId){

             const newMessage = await prisma.message.create({
                data: {
                  message: data.message,
                  authorTeacherId: data.authorTeacherId , // Connects the message to the corresponding student
                  classCodesIds: params.chatboxID,  // Connects the message to the corresponding class
                  role:'teacher', //
                }
              });

              pusher.trigger(params.chatboxID, 'new-message', {
                message:{
                  id: newMessage.id,
                  message: data.message,
                  authorTeacherId: data.authorTeacherId , // Connects the message to the corresponding student
                  classCodesIds: classId?.id,  // Connects the message to the corresponding class
                  role:'teacher',
                  createdAt: new Date(),
                  authorTeacher:{
                    id:currentUserTeacher.id,
                    f_name:currentUserTeacher.f_name,
                    l_name:currentUserTeacher.l_name,
                    image:currentUserTeacher.image,
                    }
                }
              });
              
     
          return NextResponse.json({ message: 'success'});
        }

  } else  { 
      return new Response(JSON.stringify({ message:'not authorized' }))
      ;}
} catch (error) {
  console.error(error);
  return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
}

}
return new Response(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
}