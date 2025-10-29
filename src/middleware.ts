/**
 * @file middleware.ts
 * @description Next.js 미들웨어 - Supabase 인증 통합
 *
 * 이 파일은 Next.js 애플리케이션의 미들웨어를 정의합니다.
 * Supabase 인증 세션을 관리하고, 보호된 경로에 대한 접근 제어를 수행합니다.
 *
 * 주요 기능:
 * 1. Supabase 인증 세션 자동 갱신
 * 2. 보호된 경로에 대한 인증 확인
 * 3. 로그인 상태에 따른 자동 리다이렉션
 *
 * 구현 로직:
 * - Supabase updateSession 함수를 사용하여 세션 관리
 * - 인증이 필요한 페이지 접근 시 로그인 페이지로 리다이렉션
 * - 로그인된 사용자가 로그인 페이지 접근 시 홈으로 리다이렉션
 *
 * @dependencies
 * - @supabase/ssr
 * - next/server
 */

import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { logger } from "@/utils/logger";

export async function middleware(request: NextRequest) {
  logger.group("🔐 Middleware 실행");
  console.log("경로:", request.nextUrl.pathname);
  console.log("시간:", new Date().toISOString());

  const response = await updateSession(request);

  console.log("응답 상태:", response.status);
  logger.groupEnd();

  return response;
}

export const config = {
  matcher: [
    // Next.js 내부 파일 및 정적 파일 제외
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API 라우트 항상 실행
    "/(api|trpc)(.*)",
  ],
};
