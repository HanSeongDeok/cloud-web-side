import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, LogIn, AlertCircle } from "lucide-react";
import { useState } from "react";
import { HmgSsoCompany, HmgSsoLoginType, type HmgSsoHealthcheckResponse } from "@/types/login";
import type { ApiResponse, ErrorResponse } from "@/types/common";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ssoAuthorize, ssoHealthcheck } from "@/handlers/services/ssoLogin.service.handler";

export function SSOLoginPage() {
  const [selectedCompany, setSelectedCompany] = useState<HmgSsoCompany>(HmgSsoCompany.HMC);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const companyOptions = [
    { value: HmgSsoCompany.HMC, label: "현대자동차" },
    // { value: HmgSsoCompany.HAE, label: "현대오토에버" },
    // { value: HmgSsoCompany.KMC, label: "기아자동차" },
    // { value: HmgSsoCompany.HKMC, label: "현대기아차" },
  ];

  const getErrorMessage = (status: string): string => {
    // VTDM 서버 문제
    if (["2000", "2100", "4000"].includes(status)) {
      return "현재 VTDM 서버에 문제가 있어 HMG SSO 로그인 기능이 이용 불가능합니다. 잠시 후 다시 시도해주세요.";
    }

    // HMG SSO 서버 문제
    if (["3000", "3100", "3200", "3300", "5000"].includes(status)) {
      return "현재 HMG SSO 서버에 문제가 있어 로그인 기능이 이용 불가능합니다. 관리자에게 문의해주세요.";
    }

    return "현재 HMG SSO 로그인 기능이 이용 불가능합니다.";
  };

  const handleSsoLogin = async (loginType: HmgSsoLoginType) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 헬스체크 요청
      const healthcheckResponse = await ssoHealthcheck({
        company: selectedCompany,
        loginType: loginType,
      });

      if (healthcheckResponse.ok) {
        const apiResponse: ApiResponse<HmgSsoHealthcheckResponse> = await healthcheckResponse.json();
        const healthcheckData = apiResponse.data;

        if (healthcheckData.result) {
          // 2. 헬스체크 성공 시 authorize로 리다이렉트
          if (healthcheckData.state) {
            ssoAuthorize(healthcheckData.state);
          } else {
            setError("인증 상태 정보가 없습니다. 다시 시도해주세요.");
            setShowErrorDialog(true);
          }
        } else {
          // 3. 헬스체크 실패 시 에러 메시지 표시
          const errorMessage = healthcheckData.status
            ? getErrorMessage(healthcheckData.status)
            : healthcheckData.message || "헬스체크 실패";
          setError(errorMessage);
          setShowErrorDialog(true);
        }
      } else {
        const errorData: ErrorResponse = await healthcheckResponse.json();
        setError(errorData.message || "서버 연결에 실패했습니다.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("SSO 로그인 중 오류:", error);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center bg-muted px-4'>
      <Card className='w-[800px] max-w-xl shadow-xl'>
        {isLoading && (
          <div className='absolute inset-0 z-20 grid place-items-center bg-white/60 backdrop-blur-sm rounded-lg'>
            <Loader2 className='h-16 w-16 animate-spin text-[#0B1F3A]' aria-label='로딩 중' />
          </div>
        )}
        <CardHeader>
          <div className='flex justify-end'>
            <LogIn className='w-7 h-7' />
          </div>
          <CardTitle className='text-center text-3xl font-bold'>로그인</CardTitle>
          {/* <CardDescription className='text-center'>VTDM HMG SSO Login</CardDescription> */}
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div>
              {/* <label className="block text-sm font-medium mb-2">회사 선택:</label> */}
              <Select
                value={selectedCompany}
                onValueChange={(value) => setSelectedCompany(value as HmgSsoCompany)}
                disabled={isLoading}
              >
                <SelectTrigger className='w-[50%] mx-auto'>
                  <SelectValue placeholder='회사를 선택하세요' />
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-white text-gray-900 border shadow-md' position='popper'>
                  {companyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* {error && (
              <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md border'>
                <div className='flex items-center'>
                  <AlertCircle className='h-4 w-4 mr-2' />
                  {error}
                </div>
              </div>
            )} */}
          </div>
        </CardContent>

        <CardFooter className='flex-col gap-4'>
          <Button
            variant='outline'
            className='w-full h-12 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white border-0'
            onClick={() => handleSsoLogin(HmgSsoLoginType.SSO_LOGIN)}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "간편 로그인"}
          </Button>

          <Button
            variant='outline'
            className='w-full h-12 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white border-0'
            onClick={() => handleSsoLogin(HmgSsoLoginType.MANUAL_LOGIN)}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "일반 로그인"}
          </Button>
        </CardFooter>

        {/* 에러 다이얼로그 */}
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center text-red-600'>
                <AlertCircle className='h-5 w-5 mr-2' />
                로그인 오류
              </AlertDialogTitle>
              <AlertDialogDescription className='text-gray-700'>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowErrorDialog(false)}>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
