import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 💡 บรรทัดสำคัญ: ถ้าอยู่หน้า login อยู่แล้ว ให้ปล่อยผ่านไปเลย ไม่ต้องเช็คอะไรต่อ
  if (pathname.startsWith("/login")) {
    // แต่ถ้า login แล้วดันจะมาหน้า login อีก ให้ดีดไปหน้าแรก
    if (token) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  const protectedPaths = ["/insights", "/log", "", "/overview"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
