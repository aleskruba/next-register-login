import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'School app',
  description: 'School app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body >
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <div className='mx-auto max-w-5xl text-2xl gap-2 mb-10'>
              <Navbar/>
              <div className='flex justify-center'>
             {children}
             </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
