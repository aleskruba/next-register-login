import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    const data = await req.json();
    const {         f_name,
        l_name,
        email,
        image,
        role,
        languages,
        password,
        confirm_password} = data;
  try {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return new NextResponse('Invalid email address or Passwords do not match', {status: 422,  statusText: 'Invalid email address or Passwords do not match'});
    }

    if (!email || !password || !confirm_password) {
              return new NextResponse('Missing info or wrong passwrod',{status:400,statusText: 'Missing info or wrong passwrod'})
    }

    if (password !== confirm_password) {
      return new NextResponse('Invalid email address or Passwords do not match', { status: 422 ,statusText: 'Invalid email address or Passwords do not match'});
    }

  
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingAdmin || existingStudent || existingTeacher) {
      return new NextResponse('Email already exists', {
        status: 422,
        statusText: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
  
    if (role=='Admin') {
       const user = await prisma.admin.create({
        data: {
            f_name,
            l_name,
            email,
            image,
            hashedPassword,
            role,
          }
        });
    }   
    if (role=='Student') {
        const user = await prisma.student.create({
         data: {
             f_name,
             l_name,
             email,
             image,
             hashedPassword,
             role,
           }
         });
     }   
     if (role=='Teacher') {
        const user = await prisma.teacher.create({
         data: {
             f_name,
             l_name,
             email,
             image,
             languages,
             hashedPassword,
             role,
           }
         });
     }   
   
 
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ message: 'Failed to process the registration' }),
        { status: 500 }
      );
    }
  } 
