import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';



export async function POST(req: NextRequest) {
  const Pusher = require("pusher");

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET ,
    cluster: 'eu',
    useTls:true,
  
  })
  
    const session = await getServerSession();
    const data = await req.json();
    console.log(data);



    if (!data.message){
      return new Response(JSON.stringify({ message:'empty' }))

    } 
     else {

  try {
    if (session) {
        const currentUserStudent = await prisma.student.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });

        
        if (currentUserStudent && currentUserStudent?.id == data.authorStudentId){

                  const classId = await prisma.class.findFirst({
                    where: {
                        studentClassesIds: {
                            has: currentUserStudent?.id
                        }
                    }
                });
        
                console.log('Student wrote',data , 'CLASS',classId?.classCode)

                const newMessage = await prisma.message.create({
                  data: {
                    message: data.message,
                    authorStudentId: data.authorStudentId , // Connects the message to the corresponding student
                    classCodesIds: classId?.id,  // Connects the message to the corresponding class
                    role:'student'
                  }
                });

               // console.log('newMessage',newMessage)
                pusher.trigger(data.classCodesIds, 'new-message', {
                  message:{
                    id:newMessage.id,
                    message: data.message,
                    authorStudentId: data.authorStudentId , // Connects the message to the corresponding student
                    classCodesIds: classId?.id,  // Connects the message to the corresponding class
                    role:'student',
                    createdAt: new Date(),
                    authorStudent:{
                      id:currentUserStudent.id,
                      f_name:currentUserStudent.f_name,
                      l_name:currentUserStudent.l_name,
                      image:currentUserStudent.image,
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




export async function DELETE(req: NextRequest) {

  const Pusher = require("pusher");

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET ,
    cluster: 'eu',
    useTls:true,
  
  })

  const session = await getServerSession();
  const data = await req.json();

  try {

    if (session) {

      const messageToBeDeleted = await prisma.message.findFirst({
        where: { id: data.messageID },
      });
      
      if (!messageToBeDeleted){
        return new NextResponse(JSON.stringify({ message: 'This messagge does not exist' }));
      }

    //  console.log('messageToBeDeleted',messageToBeDeleted);

      const currentUserTeacher = await prisma.teacher.findUnique({
        where: {
          email: session.user?.email as string, // Ensure session.user.email exists and is a string
        },
      });

      const currentUserStudent = await prisma.student.findUnique({
        where: {
          email: session.user?.email as string, // Ensure session.user.email exists and is a string
        },
      });

       if (currentUserStudent && currentUserStudent?.id == messageToBeDeleted.authorStudentId ) {
   
        const response = await prisma.message.delete({
          where: { id: data.messageID },
      })

     //  console.log('delete',response)
      pusher.trigger(messageToBeDeleted.classCodesIds, 'delete-message', { response }); 
    // console.log(messageToBeDeleted)
      return new NextResponse(JSON.stringify({ data: 'success' }));
    }

      if (currentUserTeacher && currentUserTeacher?.id == messageToBeDeleted.authorTeacherId) {
        const response = await prisma.message.delete({
          where: { id: data.messageID },
      })
      pusher.trigger(messageToBeDeleted.classCodesIds, 'delete-message', { response }); 
      console.log('message to be deleted from teacher',response)
      return new NextResponse(JSON.stringify({ data: 'success' }));
      }
   
 

       

    } else {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Failed to process the message' }), { status: 500 });
  }
}
