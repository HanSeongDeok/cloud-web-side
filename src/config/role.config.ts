// Role 타입 정의
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// Role을 한글로 매핑하는 객체
export const ROLE_MAPPING: Record<Role, string> = {
  'USER': '사용자',
  'ADMIN': '관리자', 
  'SUPER_ADMIN': '최고 관리자',
};

export const getRoleDisplayName = (role: string | undefined): string => {
  return ROLE_MAPPING[role as Role] || '개발자 모드';
};

export const isAdmin = (role: string | undefined): boolean => {
  return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === undefined;
};
