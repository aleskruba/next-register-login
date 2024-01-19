import NextAuth from "next-auth"
import { Account,User as AuthUser } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import prisma from '@/app/libs/prismadb';
import bcrypt from 'bcrypt'

export const authOptions:any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any): Promise<any> {     
          
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
        },
      }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        return true;
      }
    }
}
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };