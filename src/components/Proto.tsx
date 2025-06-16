import { memo } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const Proto2 = memo(() => {
    return (
        <header className="w-full border-b bg-white px-6 py-2 flex items-center justify-between shadow-sm">
            <a href="#" className="text-sm font-semibold text-blue-800 underline">
                Service name
            </a>
            <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-6 text-sm">
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-blue-600 hover:underline">
                            저장소
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-black hover:underline">
                            복구
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-black hover:underline">
                            대시보드
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="flex items-center gap-1 cursor-pointer">
                        <Lock className="w-4 h-4 text-black" />
                        <span className="text-black">관리자</span>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src="" alt="@user" />
                                <AvatarFallback>OO</AvatarFallback>
                            </Avatar>
                            <span>OO팀/홍길동</span>
                        </div>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
});


const Proto = memo(() => {
    return (
        <div className="w-full">
            <nav className="fixed top-0 left-0 w-full bg-background shadow-md z-50 px-6 py-3 border-b border-border flex items-center">
                <NavigationMenu className="ml-auto">
                    <NavigationMenuList className="flex items-center gap-6">
                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg">저장소</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg">복구</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg">대시보드</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="font-medium px-2 py-1 hover:underline">
                                관리자
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>

            <main className="pt-20 px-4">
                <h1 className="text-2xl font-bold">Prototype Page</h1>
                <p className="mt-4 text-muted-foreground">
                    여기에 본문 콘텐츠가 들어갑니다.
                </p>
            </main>
        </div>
    );
});

export default Proto;

