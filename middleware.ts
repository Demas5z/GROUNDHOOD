import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const path = req.nextUrl.pathname

  const isAuthPage = path === '/login' || path === '/register'
  const isAccountPage = path.startsWith('/account')
  const isAdminPage = path.startsWith('/admin')

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    const dest = role === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(new URL(dest, req.url))
  }

  // Protect /account: must be logged in
  if (isAccountPage && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  // Protect /admin: must be logged in AND admin role
  if (isAdminPage) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/account', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/login', '/register', '/account/:path*', '/admin/:path*'],
}
