import { memo, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CircleHelpIcon, CircleIcon, CircleCheckIcon, ChevronDownIcon } from "lucide-react";
import ProtoPage3 from "@/components/pages/ProtoPage3";
import StoragePage from "@/components/pages/StoragePage";

const HeaderV2 = memo(() => {
    const [activePage, setActivePage] = useState(() => StoragePage);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-md">
            <nav className="flex items-center justify-between mx-auto">
                {/* 로고 */}
                <div className="flex items-center">
                    <a href="/" className="text-xl sm:text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
                        VTDM
                    </a>
                </div>

                {/* 중앙 네비 */}
                <NavigationMenu className="hidden sm:flex ml-auto">
                    <NavigationMenuList className="flex items-center gap-4 lg:gap-4">
                        {/* 저장소 */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                className={`text-xl sm:text-xl font-semibold cursor-pointer transition-colors
                  ${activePage === StoragePage
                                        ? "text-blue-400"
                                        : "text-gray-700 hover:text-blue-400"
                                    }`}
                                onClick={() => setActivePage(StoragePage)}
                            >
                                저장소
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* 대시보드 */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                className={`text-xl sm:text-xl font-semibold cursor-pointer transition-colors
                  ${activePage === ProtoPage3
                                        ? "text-blue-400"
                                        : "text-gray-700 hover:text-blue-400"
                                    }`}
                                onClick={() => setActivePage(ProtoPage3)}
                            >
                                대시보드
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* 세로 구분선 */}
                        <div className="h-10 w-px bg-gray-300"></div>

                        {/* 프로필 */}
                        <NavigationMenuItem className="ml-3">
                            <DropdownMenu 
                                modal={false}
                                onOpenChange={(open) => {
                                    setIsDropdownOpen(open);
                                }}
                            >
                                <DropdownMenuTrigger asChild>
                                    <button 
                                        className="flex items-center gap-2 sm:gap-2 outline-none cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                            <AvatarImage src="" alt="@user" />
                                            <AvatarFallback className="text-xs sm:text-sm bg-blue-300">
                                                O
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-lg sm:text-lg font-bold flex items-center">
                                                제어안전성능 1팀 / 홍길동
                                                <ChevronDownIcon 
                                                    className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${
                                                        isDropdownOpen ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </span>
                                            <span className="text-xs sm:text-sm text-blue-400">
                                                admin <span className="text-gray-400 ml-1">(관리자)</span>
                                            </span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="bottom"
                                    align="end"
                                    sideOffset={10}
                                    avoidCollisions={false}
                                    className="w-[200px] bg-white border border-gray-200 shadow-lg"
                                >
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">Tasks</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center gap-2">
                                        <CircleHelpIcon className="h-4 w-4" /> Backlog
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2">
                                        <CircleIcon className="h-4 w-4" /> To Do
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2">
                                        <CircleCheckIcon className="h-4 w-4" /> Done
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
        </header>
    );
});

export default HeaderV2;
