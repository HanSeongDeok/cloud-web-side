import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { decodeJWT } from "@/handlers/events/jwt.config.handler";
import { permissionPage, permissionPageDev, requestPermission, requestPermissionDev } from "@/handlers/services/ssoLogin.service.handler";
import { memo, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUserPermissionStore, type PermissionData } from "@/stores/useUserPermissionStore";

interface ErrorResponse {
    code: string;
    debugMessage: string | null;
    message: string;
    path: string;
    status: number;
    success: boolean;
    traceId: string | null;
}

interface checkResponse {
    success: boolean;
    data: PermissionStatusResponse;
}

interface PermissionStatusResponse {
    hasPermissionRequested: boolean;
    message: string;
    needsPermissionRequest: boolean;
    nextAction: string;
    role: string;
    whitelisted: boolean;
}

const PermissionPage = memo(() => {
    const navigate = useNavigate();
    const setPermissionData = useUserPermissionStore((state) => state.setPermissionData);
    const permissionData = useUserPermissionStore((state) => state.permissionData);
    
    // 초기값을 true로 설정
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                // 권한 확인 API 호출
                const response = await permissionPage()
                if (response.ok) {
                    // const checkResponse: checkResponse = await response.json()
                    // console.log(checkResponse)

                    // const checkData = checkResponse.data
                    // console.log(checkData)
                    
                    // if (checkData.whitelisted) {
                    //     setPermissionData({ hasPermission: true, isRequest: false })
                    //     navigate('/storage', { replace: true })
                    //     return;
                    // }

                    // if (checkData.hasPermissionRequested) {
                    //     setPermissionData({ hasPermission: false, isRequest: true })
                    //     setIsLoading(false);
                    //     return;
                    // }

                    const permissionData: PermissionData = await response.json()
                    console.log(permissionData)

                    if(permissionData.hasPermission) {
                        setPermissionData({ hasPermission: true, isRequesting: false })
                        navigate('/storage', { replace: true })
                        return;
                    }

                    if(permissionData.isRequesting) {
                        setPermissionData({ hasPermission: false, isRequesting: true })
                        setIsLoading(false);
                        return;
                    }

                    // 권한이 없고 요청도 안한 경우
                    setPermissionData({ hasPermission: false, isRequesting: false })
                    setIsLoading(false);
                    return;

                } else {
                    const errorData: ErrorResponse = await response.json()
                    if (errorData.code === 'AUTH_001' || errorData.code === 'AUTH_002' || errorData.code === 'AUTH_003') {
                        // 인증 에러인 경우 로그인 페이지로 이동 (로딩 상태 해제하지 않음)
                        navigate('/login', { replace: true })
                        return;
                    }

                    if (errorData.code === 'AUTH_008') {
                        setPermissionData({ isRequesting: true })
                    }
                    setIsLoading(false); // 기타 에러인 경우에만 로딩 해제
                    return;
                }
            } catch (error) {
                console.error('권한 확인 중 오류:', error);
                setIsLoading(false); // 에러 발생 시 로딩 해제
            }
        }
        checkPermission();
    }, []);

    // 로딩 중일 때는 로딩 화면 표시
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

    // 로딩이 완료되고 권한이 없는 경우에만 권한 페이지 표시
    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-muted px-4">
            <Card className="w-[800px] max-w-xl shadow-xl">
                <CardHeader className="space-y-4">
                    <CardTitle className="text-center text-2xl font-bold">접근 권한이 없습니다!</CardTitle>
                    <CardDescription className="text-center">
                        <span>이 계정은 해당 시스템에 대한 접근 권한이 없습니다.</span><br />
                        <span className="text-blue-500">관리자에게 문의해주세요.</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    {permissionData.isRequesting && (
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-gray-500">권한 요청 중...</p>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full h-12 cursor-pointer"
                        disabled={permissionData.isRequesting}
                        onClick={async (e) => {
                            e.preventDefault();
                            const response = await requestPermission()
                            if (response.ok) {
                                console.log(response)
                                setPermissionData({ isRequesting: true })
                            } else {
                                const errorData: ErrorResponse = await response.json()
                                console.log(errorData)
                                if (errorData.code === 'AUTH_008') {
                                    setPermissionData({ isRequesting: true })
                                }

                                if (errorData.code === 'COMMON_004' || errorData.code === 'COMMON_001') {
                                    navigate('/login', { replace: true })
                                }
                                return;
                            }
                        }}>
                        권한 요청
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
})

export default PermissionPage;