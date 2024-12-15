import { NextResponse } from "next/server";

export function middleware(req:any) {
  const hostname = req.headers.get("host");

  if (
    req.nextUrl.pathname.startsWith("/_next") || 
    req.nextUrl.pathname.startsWith("/api") || 
    req.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (hostname.startsWith("verify.")) {
    const url = req.nextUrl.clone();
    url.pathname = "/verify";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
