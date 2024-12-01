import { ReactNode } from 'react'
import './global.scss'

export default function RootLayout({children}:{children:ReactNode}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}