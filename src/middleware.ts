import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    const response = NextResponse.next()
    response.headers.set("x-current-path", request.nextUrl.pathname)

    const pathname = request.nextUrl.pathname

    // Public paths that never require auth
    const isPublic =
        pathname.startsWith("/authenticate") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/instance") ||
        pathname === "/docs" ||
        pathname === "/"

    if (isPublic) return response

    // better-auth sets this cookie on login; check existence (full validation in server actions)
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ??
        request.cookies.get("__Secure-better-auth.session_token")

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/authenticate", request.url))
    }

    return response
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
