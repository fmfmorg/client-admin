import { httpRequestHeader } from '@misc'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    const response = NextResponse.next()
    const sessionCookie = request.cookies.get('sessionID')
    const currentSessionID = sessionCookie ? sessionCookie.value : ""

    const encodedPathname = encodeURIComponent( pathname + search )

    const csrfToken = crypto.randomUUID()

    console.log(csrfToken)
    
    if (pathname === '/sign-in'){
        if (currentSessionID === ""){
            response.headers.set('X-CSRF',csrfToken)
            response.cookies.set({
                name: 'csrf',
                value: csrfToken,
                path: '/',
                httpOnly: true,
                sameSite:true,
            })
        } else {
            const 
                resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/sign-in-page-init`,{
                    headers:httpRequestHeader(true,'SSR',false,'',currentSessionID)
                }),
                { ok } = resp
            
            if (ok){
                // if response is OK 200, that means the user is already signed in, redirect user to page '/'
                const { signedIn } = await resp.json() as { signedIn: boolean }
                if (signedIn) return NextResponse.redirect(new URL('/dashboard', request.url))
            } else {
                response.headers.set('X-CSRF',csrfToken)
                response.cookies.set({
                    name: 'csrf',
                    value: csrfToken,
                    path: '/',
                    httpOnly: true,
                    sameSite:true,
                })
                response.cookies.set({
                    name: 'sessionID',
                    value: '',
                    path: '/',
                    expires: Date.now() - 1000000,
                    httpOnly: true,
                    sameSite:true,
                })
            }
        }
    } else if ( pathname === '/' ){
        if (currentSessionID === "") {
            response.headers.set('X-CSRF',csrfToken)
            response.cookies.set({
                name: 'csrf',
                value: csrfToken,
                path: '/',
                httpOnly: true,
                sameSite:true,
            })
            return NextResponse.redirect(new URL('/sign-in', request.url)) 
        }
        const 
            resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/sign-in-page-init`,{
                headers:httpRequestHeader(true,'SSR',true,'',currentSessionID)
            }),
            { ok } = resp

        if (ok){
            const { signedIn } = await resp.json() as { signedIn: boolean }
            if (signedIn) {
                response.headers.set('X-CSRF',csrfToken)
                response.cookies.set({
                    name: 'csrf',
                    value: csrfToken,
                    path: '/',
                    httpOnly: true,
                    sameSite:true,
                })
                return NextResponse.redirect(new URL('/dashboard', request.url))
            } else {
                response.headers.set('X-CSRF',csrfToken)
                response.cookies.set({
                    name: 'csrf',
                    value: csrfToken,
                    path: '/',
                    httpOnly: true,
                    sameSite:true,
                })
                response.cookies.set({
                    name: 'sessionID',
                    value: '',
                    path: '/',
                    expires: Date.now() - 1000000,
                    httpOnly: true,
                    sameSite:true,
                })
                return NextResponse.redirect(new URL('/sign-in', request.url))
            }
        } else {
            response.headers.set('X-CSRF',csrfToken)
            response.cookies.set({
                name: 'csrf',
                value: csrfToken,
                path: '/',
                httpOnly: true,
                sameSite:true,
            })
            response.cookies.set({
                name: 'sessionID',
                value: '',
                path: '/',
                expires: Date.now() - 1000000,
                httpOnly: true,
                sameSite:true,
            })
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
    } else {
        if (currentSessionID === "") {
            response.headers.set('X-CSRF',csrfToken)
            response.cookies.set({
                name: 'csrf',
                value: csrfToken,
                path: '/',
                httpOnly: true,
                sameSite:true,
            })
            return NextResponse.redirect(new URL(`/sign-in?rd=${ encodedPathname }`, request.url)) 
        }
        const 
            resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/sign-in-page-init`,{
                headers:httpRequestHeader(true,'SSR',true,'',currentSessionID)
            }),
            { ok } = resp

        if (ok){
            const { signedIn, sessionID, expiresAt } = await resp.json() as { 
                staffPermission: number;
                signedIn: boolean;
                sessionID: string;
                expiresAt: number;
            }

            if (signedIn) {
                response.headers.set('X-CSRF',csrfToken)
                response.cookies.set({
                    name: 'csrf',
                    value: csrfToken,
                    path: '/',
                    httpOnly: true,
                    sameSite:true,
                })
                response.cookies.set({
                    name: 'sessionID',
                    value: sessionID,
                    path: '/',
                    expires: expiresAt,
                    httpOnly: true,
                    // secure: true,
                    sameSite: true,
                })
            } else {
                response.headers.set('X-CSRF',csrfToken)
                response.cookies.set({
                    name: 'csrf',
                    value: csrfToken,
                    path: '/',
                    httpOnly: true,
                    sameSite:true,
                })
                response.cookies.set({
                    name: 'sessionID',
                    value: '',
                    path: '/',
                    expires: Date.now() - 1000000,
                    sameSite:true,
                })
                return NextResponse.redirect(new URL(`/sign-in?rd=${ encodedPathname }`, request.url))
            }
        } else {
            response.headers.set('X-CSRF',csrfToken)
            response.cookies.set({
                name: 'csrf',
                value: csrfToken,
                path: '/',
                httpOnly: true,
                sameSite:true,
            })
            response.cookies.set({
                name: 'sessionID',
                value: '',
                path: '/',
                expires: Date.now() - 1000000,
                sameSite:true,
            })
            return NextResponse.redirect(new URL(`/sign-in?rd=${ encodedPathname }`, request.url))
        }
    }

    return response
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }