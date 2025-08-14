import { permissionPage } from '@/handlers/services/ssoLogin.service.handler';
import { useUserPermissionStore, type PermissionData } from '@/stores/useUserPermissionStore';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ErrorResponse {
  code: string;
  debugMessage: string | null;
  message: string;
  path: string;
  status: number;
  success: boolean;
  traceId: string | null;
}

interface CheckResponse {
  success: boolean;
  data: PermissionStatusResponse;
}

interface PermissionStatusResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  isWhitelisted: boolean;
}

export function SSOLoginVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setPermissionData = useUserPermissionStore((state) => state.setPermissionData)
  
  useEffect(() => {
    const checkPermission = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (success) {
        setStatus('success');
      }

      if (error) {
        console.log(error + "server_error")
        setStatus('error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      // 권한 확인 API 호출
      const response = await permissionPage()

      if (response.ok) {
        // const data: PermissionData = await response.json()
        // if (data.hasPermission) {
        //   setPermissionData({ hasPermission: true, isRequesting: false })
        //   navigate('/storage', { replace: true })
        //   return;
        // }

        const checkResponse: CheckResponse = await response.json()
        const checkData = checkResponse.data
        console.log(checkData)

        if (checkData.isWhitelisted) {
          setPermissionData({ hasPermission: true, isRequesting: false })
          navigate('/storage', { replace: true })
          return;
        }

      } else {
        const errorData: ErrorResponse = await response.json()

        if (errorData.code === 'AUTH_007' || errorData.code === 'AUTH_008' || errorData.code === 'AUTH_004') {
          setPermissionData({ hasPermission: false, isRequesting: false })
          navigate('/permission', { replace: true })
          return;
        }

        if (errorData.code.startsWith('AUTH_') || errorData.code.startsWith('COMMON_')) {
          navigate('/login', { replace: true })
          return;
        }
      }

      setTimeout(() => navigate('/permission', { replace: true }));
      return;
    }
    checkPermission();
  }, []);

  if (isLoading) {
    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-muted">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">처리중...</p>
            </div>
        </div>
    );
}

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold">처리 중...</h2>
            <p className="text-muted-foreground">잠시만 기다려주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl">✓</div>
            <h2 className="text-xl font-semibold">로그인 성공!</h2>
            <p className="text-muted-foreground">메인 페이지로 이동합니다.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl">✗</div>
            <h2 className="text-xl font-semibold">로그인 실패</h2>
            <p className="text-muted-foreground">로그인 페이지로 이동합니다.</p>
          </>
        )}
      </div>
    </div>
  );
} 