import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import ToasterContext from '@/context/toaster-context'
import { getServerSession } from 'next-auth'
import SessionProvider from "@/utils/SessionProvider";

export const metadata: Metadata = {
  title: 'School app',
  description: 'School app',
}

export default async  function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 const session = await getServerSession();
  console.log('session',session )

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body >
      <SessionProvider session={session}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <div className='mx-auto max-w-5xl text-2xl gap-2 mb-10'>
                <div className='flex justify-center'>
                <ToasterContext/>
             {children}
             </div>
          </div>
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
