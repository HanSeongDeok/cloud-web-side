/**
 * 라우트 경로를 모듈화하여 관리
 * src/routes/Router.tsx의 라우트 구조및 사전 협의에 따른 Readme.md 참고.
 * @author Han
 */

export const ROUTE_PATH = {
  HOME: "/home",
  BLOCK: "/block",
  PERMISSION: "/permission",
  LOGIN: "/login",
  LOGIN_VERIFY: "/login-verify",
  NOT_FOUND: "*",

  ROOT: "/",
  STORAGE: "/storage",
  MY_PAGE: "/my-page",
  TRASH: "/trash",
  DASHBOARD: "/dashboard",

  ADMIN_ROOT: "/admin",
  ADMIN_LOGGING: "/admin/logging",
  ADMIN_DB_CONFIG: "/admin/db-config",

  WHITELIST_ROOT: "/admin/whitelist",
  WHITELIST_LIST: "/admin/whitelist/list",
  WHITELIST_REQUESTS: "/admin/whitelist/requests",
  WHITELIST_MANAGERS: "/admin/whitelist/managers",
} as const;
