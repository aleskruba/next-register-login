import { NextResponse,NextRequest } from "next/server";
import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth';import { createClient } from 'redis';

export async function POST(req: NextRequest) {
    const Pusher = require("pusher");
  
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID ,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY ,
      secret: process.env.PUSHER_SECRET ,
      cluster: 'eu',
      useTls:true,
    
    })
    const data = await req.json();
    console.log('data',data);

    const client = createClient({
      url: "redis://default:d55a9b7fbf2d4aae93cdcc00fa12ef82@eu1-sought-sawfish-39515.upstash.io:39515"
    });

    try {
      await client.connect();

      const session = await getServerSession();



      if (session) {
        const currentUser = await prisma.student.findUnique({
          where: {
            email: session.user?.email as string // Ensure session.user.email exists and is a string
          }
        });

      const serializedActiveStudents = await client.get('activeStudents');

      if (serializedActiveStudents !== null) {
        const activeStudents = JSON.parse(serializedActiveStudents);
        const updatedActiveStudents = activeStudents.filter((id: string | undefined) => id !== currentUser?.id);
        console.log('updatedActiveStudents',updatedActiveStudents)
        await client.set('activeStudents', JSON.stringify(updatedActiveStudents));

        return new Response(JSON.stringify({activeStudents:activeStudents }));
    }
    else {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
        
    }
    } catch (error) {
      console.error('Error removing user from active list:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
     finally {
      await client.disconnect();
    
  } 
  
}
