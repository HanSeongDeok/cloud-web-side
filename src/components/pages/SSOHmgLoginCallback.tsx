// src/components/pages/SSOLoginCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle } from "lucide-react";
import type { SsoCallbackParams } from '@/types/login';
import type { UserDto } from '@/types/user';
import type { ApiResponse, ErrorResponse } from '@/types/common';
import { getCurrentUser } from '@/handlers/services/ssoLogin.service.handler';
import { useUserPermissionStore } from '@/stores/useUserPermissionStore';


export function SSOLoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const setPermissionData = useUserPermissionStore((state) => state.setPermissionData);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL 파라미터에서 상태 확인
        const callbackStatus = searchParams.get('status') as SsoCallbackParams['status'];
        const callbackMessage = searchParams.get('message') || '';

        console.log('SSO Callback params:', { callbackStatus, callbackMessage });

        if (callbackStatus === 'fail') {
          // 로그인 실패 시
          setStatus('error');
          setMessage(decodeURIComponent(callbackMessage) || 'SSO 로그인에 실패했습니다.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        if (callbackStatus === 'success') {
          // 로그인 성공 시 사용자 정보 조회
          setStatus('success');
          setMessage('로그인 성공! 사용자 정보를 확인 중입니다...');

          try {
            const userResponse = await getCurrentUser();
            
            if (userResponse.ok) {
              const apiResponse: ApiResponse<UserDto> = await userResponse.json();
              const userData = apiResponse.data as UserDto;

              // 스토어에 사용자 정보 저장
              setPermissionData({
                hasPermission: true,
                isRequesting: false,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                id: userData.id
              });

              // 메인 페이지로 이동
              setTimeout(() => navigate('/storage', { replace: true }), 1500);
              return;

            } else {
              const errorData: ErrorResponse = await userResponse.json();
                
              // 권한 관련 에러 코드 처리
              if (['AUTH_007', 'AUTH_008'].includes(errorData.code)) {
                setPermissionData({ hasPermission: false, isRequesting: false });
                navigate('/permission', { replace: true });
                return;
              }

              // 기타 인증 에러
              if (errorData.code.startsWith('AUTH_')) {
                setStatus('error');
                setMessage(errorData.message || '사용자 정보 조회에 실패했습니다.');
                setTimeout(() => navigate('/login', { replace: true }), 3000);
                return;
              }
            }
          } catch (userError) {
            console.error('사용자 정보 조회 중 오류:', userError);
            setStatus('error');
            setMessage('사용자 정보 조회 중 오류가 발생했습니다.');
            setTimeout(() => navigate('/login', { replace: true }), 3000);
            return;
          }
        }

        // 파라미터가 없거나 알 수 없는 상태인 경우
        setStatus('error');
        setMessage('올바르지 않은 로그인 응답입니다.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);

      } catch (error) {
        console.error('SSO 콜백 처리 중 오류:', error);
        setStatus('error');
        setMessage('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setPermissionData]);

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-muted px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-xl font-semibold">로그인 처리 중...</h2>
              <p className="text-muted-foreground">잠시만 기다려주세요.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">로그인 성공!</h2>
              <p className="text-muted-foreground">메인 페이지로 이동합니다.</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">로그인 실패</h2>
              <p className="text-muted-foreground">로그인 페이지로 이동합니다.</p>
            </>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-lg border ${
            status === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p className="text-center text-sm">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}