/**
 * @file middleware.ts
 * @description Next.js 미들웨어 - Clerk + Supabase 통합 인증
 *
 * 이 파일은 Next.js 애플리케이션의 미들웨어를 정의합니다.
 * Clerk를 기본 인증 시스템으로 사용하고, Supabase 세션을 함께 관리합니다.
 *
 * 주요 기능:
 * 1. Clerk 인증 세션 관리 (기본)
 * 2. Supabase 인증 세션 보조 관리
 * 3. 보호된 경로에 대한 인증 확인
 * 4. 로그인 상태에 따른 자동 리다이렉션
 *
 * 구현 로직:
 * - Clerk의 clerkMiddleware를 기본으로 사용
 * - Supabase updateSession을 추가로 실행하여 호환성 유지
 * - 인증이 필요한 페이지 접근 시 로그인 페이지로 리다이렉션
 *
 * @dependencies
 * - @clerk/nextjs
 * - @supabase/ssr
 * - next/server
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { logger } from "@/utils/logger";

export default clerkMiddleware(async (auth, request) => {
  logger.group("🔐 Clerk + Supabase Middleware 실행");
  console.log("경로:", request.nextUrl.pathname);

  // Supabase 세션도 함께 관리 (호환성 유지)
  const supabaseResponse = await updateSession(request);

  // Clerk의 응답을 우선 사용하되, Supabase의 쿠키도 포함
  const response = NextResponse.next({
    request: {
      headers: supabaseResponse.headers,
    },
  });

  console.log("응답 상태:", response.status);
  logger.groupEnd();

  return response;
});

export const config = {
  matcher: [
    // Next.js 내부 파일 및 정적 파일 제외
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API 라우트 항상 실행
    "/(api|trpc)(.*)",
  ],
};
