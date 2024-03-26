"use server"
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';
import { createClient } from "redis"





//const activeStudents: string[] = []



export async function GET(req: NextRequest) {

 
  const Pusher = require("pusher");

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET ,
    cluster: 'eu',
    useTls:true,
  
  })

  try {
    const session = await getServerSession();



    if (session) {
      const currentUser = await prisma.student.findUnique({
        where: {
          email: session.user?.email as string // Ensure session.user.email exists and is a string
        }
      });

      const classId = await prisma.class.findFirst({
        where: {
            studentClassesIds: {
                has: currentUser?.id
            }
        }
      })

      const cuurentUserID = currentUser?.id

      if(cuurentUserID && classId?.studentClassesIds.includes(cuurentUserID))  {

 
                const messages = await prisma.message.findMany({
                     where: {
                        classCodesIds: classId?.id // Using optional chaining to access classCode safely
                    }, 
                    include: {
                        authorStudent: true,  
                        authorTeacher: true,  
                    },
                });
                

                const client = createClient ({
                  url : "redis://default:d55a9b7fbf2d4aae93cdcc00fa12ef82@eu1-sought-sawfish-39515.upstash.io:39515"
                });
                
                client.on("error", function(err) {
                  throw err;
                });
                await client.connect()
                const activeStudents: string[] = []

    const serializedActiveStudents = await client.get('activeStudents');

    if (serializedActiveStudents !== null) {
      activeStudents.push(...JSON.parse(serializedActiveStudents));
    }

    if (!activeStudents.includes(currentUser.id)) {
       activeStudents.push(currentUser.id);
    }

    await client.set('activeStudents', JSON.stringify(activeStudents));
  

    //  console.log('Updated Active Students:', activeStudents);    
           
       pusher.trigger(classId?.id, 'active-users', { activeStudents });

     
      
        return new Response(JSON.stringify({ data:messages,activeStudents:activeStudents }));
      } else {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
      }
    } else {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

