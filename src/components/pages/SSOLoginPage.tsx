import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ssoLoginPage,
  ssoLoginPageDev,
} from "@/handlers/services/ssoLogin.service.handler";
import { Info, LogIn } from "lucide-react";

export function SSOLoginPage() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-[800px] max-w-xl shadow-xl">
        <CardHeader>
          <div className="flex justify-end">
            <LogIn className="w-7 h-7" />
          </div>
          <CardTitle className="text-center text-3xl font-bold">
            로그인 창
          </CardTitle>
          <CardDescription className="text-center">VTDM login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <span className="flex items-center justify-center">
            <Info className="w-4 h-4 text-blue-500 mr-2" />
            SSO 로그인이 필요합니다.
          </span>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            variant="default"
            className="w-full h-12 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              ssoLoginPage();
            }}
          >
            Google SSO 로그인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
