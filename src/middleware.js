import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Guard /api/admin/* — hanya admin
  if (pathname.startsWith('/api/admin/')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token autentikasi diperlukan' },
        { status: 401 }
      );
    }
    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau telah kedaluwarsa' },
        { status: 401 }
      );
    }
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // Guard /api/me/* — semua user yang sudah login
  if (pathname.startsWith('/api/me/')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token autentikasi diperlukan' },
        { status: 401 }
      );
    }
    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau telah kedaluwarsa' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/me/:path*'],
};
