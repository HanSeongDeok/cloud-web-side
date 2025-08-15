import { memo } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePageStore } from "@/stores/useNavigateStore";
import ProtoPage3 from "@/components/pages/ProtoPage3";
import StoragePage from "@/components/pages/StoragePage";

const HeaderV2 = memo(() => {
    const { setActivePage } = usePageStore();
    return (
        <header className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-md">
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
                {/* 로고/서비스명 */}
                <div className="flex items-center">
                    <a href="/" className="text-xl sm:text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
                        VTDM
                    </a>
                </div>

                {/* 중앙 네비게이션 */}
                <NavigationMenu className="hidden sm:flex">
                    <NavigationMenuList className="flex items-center gap-6 lg:gap-8">
                        <NavigationMenuItem>
                            <NavigationMenuLink 
                                className="text-sm sm:text-base font-medium hover:text-blue-400 transition-colors cursor-pointer" 
                                onClick={() => setActivePage(StoragePage)}
                            >
                                저장소
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink 
                                className="text-sm sm:text-base font-medium hover:text-blue-400 transition-colors cursor-pointer" 
                                onClick={() => setActivePage(ProtoPage3)}
                            >
                                대시보드
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                관리자
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* 우측 사용자 정보 */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src="" alt="@user" />
                        <AvatarFallback className="text-xs sm:text-sm bg-blue-600">O</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm font-medium hidden sm:block">
                        OO팀/홍길동
                    </span>
                </div>
            </nav>
        </header>
    );
});

export default HeaderV2;

