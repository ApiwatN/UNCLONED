import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    
    const authHeader = request.headers.get('authorization')
    const adminUser = 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'uncloned2026'
    
    const expectedAuth = `Basic ${btoa(`${adminUser}:${adminPassword}`)}`

    if (authHeader !== expectedAuth) {
      return new NextResponse('ระบบหลังบ้าน (Admin Only) - กรุณาเข้าสู่ระบบ', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="UNCLONED Secure Admin Dashboard"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
