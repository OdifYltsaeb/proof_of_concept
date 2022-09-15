import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// const PUBLIC_FILE = /\.(.*)$/;

// eslint-disable-next-line consistent-return
export function middleware(request: NextRequest) {
    const cookie = request.cookies.get(process.env.AUTH_COOKIE_NAME);
    if (cookie && cookie.length) {
        return NextResponse.next()
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('return', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
};

export const config = {
  matcher: ['/protected:path*', '/data:path*',],
}
