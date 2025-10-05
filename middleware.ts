// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

function isRole(value: string | undefined): value is Role {
  return value === "SUPER_ADMIN" || value === "ADMIN";
}

const publicPaths = [
  "/management/login",
  "/management/forgot-password",
  "/management/reset-password",
  "/management/signup",
  "/api",
  "/favicon.ico",
  "/student/register",
  "/",
];

// Define allowed routes per role
const roleBasedRoutes: Record<Role, string[]> = {
  SUPER_ADMIN: [
    "/management/dashboard",
    "/management/students",
    "/management/users",
  ],
  ADMIN: ["/management/dashboard", "/management/students"],
  STUDENT: [],
};

export function middleware(request: NextRequest) {
  // return NextResponse.next();
  const { pathname } = request.nextUrl;
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/management/login", request.url));
  }
  const role = request.cookies.get("role")?.value;

  if (!isRole(role)) {
    return NextResponse.redirect(new URL("/management/login", request.url));
  }
  const allowedPaths = roleBasedRoutes[role];
  const isAllowed = allowedPaths.some((path) => pathname === path);

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // User is authorized — continue
  return NextResponse.next();
}
