import NextAuth from "next-auth"
//import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { NextResponse } from 'next/server'
import prisma from "@/app/libs/prismadb"
import { getServerSession } from 'next-auth';



const handler = NextAuth({


  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
  
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' } ,
        },
      async authorize(credentials: any): Promise<any>  {
        try {
          const { email, password } = credentials;

          // Check if the user exists in the admin model
          const admin = await prisma.admin.findUnique({
            where: { email },
          });

          if (admin) {
            const isPasswordCorrect = await bcrypt.compare(password, admin.hashedPassword || '');
            if (isPasswordCorrect) {
              return admin;
            }
          }

          // Check if the user exists in the student model
          const student = await prisma.student.findUnique({
            where: { email },
          });

          if (student) {
            const isPasswordCorrect = await bcrypt.compare(password, student.hashedPassword || '');
            if (isPasswordCorrect) {
              return student;
            }
          }

          // Check if the user exists in the teacher model
          const teacher = await prisma.teacher.findUnique({
            where: { email },
          });

          if (teacher) {
            const isPasswordCorrect = await bcrypt.compare(password, teacher.hashedPassword || '');
            if (isPasswordCorrect) {
              return teacher;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      }
    })

  ], 
  
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

})


export { handler as GET, handler as POST };