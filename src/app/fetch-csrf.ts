import { headers } from 'next/headers'

export const fetchCSRF = async() => {
    const headersList = await headers()
    return headersList.get('X-CSRF')
}