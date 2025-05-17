import { ReactNode } from 'react'
import './global.scss'
import StoreProvider from '../components/StoreProvider'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}