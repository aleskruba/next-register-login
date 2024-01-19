// pages/_app.tsx
import { SessionProvider } from 'next-auth/react'
import RootLayout from '../layout'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any)

{
  return (
    <SessionProvider session={session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  )
}
