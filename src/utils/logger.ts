/**
 * 서버/클라이언트 환경에서 안전하게 사용할 수 있는 로거 유틸리티
 *
 * Vercel Edge Runtime 및 서버 환경에서는 console.group이 지원되지 않으므로
 * 안전한 대안 로깅 방법을 제공합니다.
 */

interface Logger {
  group: (label: string) => void;
  groupEnd: () => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

/**
 * 서버/클라이언트 환경에서 안전한 로거
 *
 * console.group 지원 여부에 따라 적절한 로깅 방법을 선택합니다.
 */
export const logger: Logger = {
  group: (label: string) => {
    if (typeof console.group === "function") {
      console.group(label);
    } else {
      console.log(`▶️ ${label}`);
    }
  },

  groupEnd: () => {
    if (typeof console.groupEnd === "function") {
      console.groupEnd();
    } else {
      console.log("◀️");
    }
  },

  info: (message: string, ...args: any[]) => {
    console.info(`ℹ️ ${message}`, ...args);
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ ${message}`, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    console.debug(`🐛 ${message}`, ...args);
  },
};

/**
 * 특정 로그 레벨에 대한 로거 생성 (필터링용)
 */
export function createLogger(prefix: string): Logger {
  return {
    group: (label: string) => logger.group(`${prefix}: ${label}`),
    groupEnd: () => logger.groupEnd(),
    info: (message: string, ...args: any[]) =>
      logger.info(`${prefix}: ${message}`, ...args),
    warn: (message: string, ...args: any[]) =>
      logger.warn(`${prefix}: ${message}`, ...args),
    error: (message: string, ...args: any[]) =>
      logger.error(`${prefix}: ${message}`, ...args),
    debug: (message: string, ...args: any[]) =>
      logger.debug(`${prefix}: ${message}`, ...args),
  };
}
