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
import { ChevronDownIcon, ClipboardList } from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { ROUTE_PATH } from "@/api/path.config";

// TODO 리팩토링 필요
// XXX 컴포넌트 별 세분화 및 기능별 파일 분리 필요 
const HeaderV2 = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-md">
            <nav className="flex items-center justify-between mx-auto">
                {/* 로고 */}
                <div className="flex items-center">
                    <a href="/" className="text-3xl sm:text-3xl font-bold tracking-tight hover:text-blue-400 transition-colors">
                        VTDM
                    </a>
                </div>

                {/* 중앙 네비 */}
                <NavigationMenu className="hidden sm:flex ml-auto">
                    <NavigationMenuList className="flex items-center gap-4 lg:gap-4">
                        {/* 저장소 */}
                        <NavigationMenuItem className="mr-2">
                            <NavigationMenuLink
                                className={`text-xl sm:text-xl font-semibold cursor-pointer transition-colors
                                    ${location.pathname === ROUTE_PATH.STORAGE
                                        ? "text-blue-400"
                                        : "text-gray-700 hover:text-blue-400"
                                    }`}
                                onClick={() => navigate(ROUTE_PATH.STORAGE)}
                            >
                                저장소
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* 대시보드 */}
                        <NavigationMenuItem className="mr-2">
                            <NavigationMenuLink
                                className={`text-xl sm:text-xl font-semibold cursor-pointer transition-colors
                                    ${location.pathname === ROUTE_PATH.DASHBOARD
                                        ? "text-blue-400"
                                        : "text-gray-700 hover:text-blue-400"
                                    }`}
                                onClick={() => navigate(ROUTE_PATH.DASHBOARD)}
                            >
                                대시보드
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* 세로 구분선 */}
                        <div className="h-10 w-px bg-gray-300"></div>

                        {/* 프로필 */}
                        <NavigationMenuItem className="ml-3 h-10">
                            <DropdownMenu
                                modal={false}
                                open={isDropdownOpen}
                                onOpenChange={setIsDropdownOpen}
                            >
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 sm:gap-2 outline-none cursor-pointer"
                                        onMouseEnter={() => setIsDropdownOpen(true)}
                                        onMouseLeave={() => setIsDropdownOpen(false)}
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
                                                차량솔루션2팀 / 홍길동
                                                <ChevronDownIcon
                                                    className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </span>
                                            <span className="text-xs sm:text-sm text-blue-400">
                                                admin <span className="text-gray-400 ml-1">(관리자)</span>
                                                &nbsp;
                                            </span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="bottom"
                                    align="end"
                                    sideOffset={1}
                                    avoidCollisions={false}
                                    className="w-[250px] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden translate-x-5"
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    <DropdownMenuLabel className="flex justify-center">
                                        <ClipboardList className="w-5 h-5 inline-block text-gray-400" />
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="h-0.5 bg-gray-100 opacity-100" />
                                    <NavLink to={ROUTE_PATH.ADMIN_LOGGING}>
                                        <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
                                            로그 관리
                                        </DropdownMenuItem>
                                    </NavLink>
                                    {/* <DropdownMenuSeparator className="h-0.5 bg-gray-100 opacity-100" /> */}
                                    <NavLink to={ROUTE_PATH.WHITELIST_ROOT}>
                                        <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
                                        화이트리스트
                                    </DropdownMenuItem>
                                    </NavLink>
                                    {/* <DropdownMenuSeparator className="h-0.5 bg-gray-100 opacity-100" /> */}
                                    <NavLink to={ROUTE_PATH.ADMIN_DB_CONFIG}>
                                        <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
                                            DB 관리
                                        </DropdownMenuItem>
                                    </NavLink>
                                    <DropdownMenuSeparator className="h-1 bg-gray-200 opacity-100" />
                                    <NavLink to={ROUTE_PATH.MY_PAGE}>
                                        <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
                                            마이페이지
                                        </DropdownMenuItem>
                                    </NavLink>
                                    {/* <DropdownMenuSeparator className="h-0.5 bg-gray-100 opacity-100" /> */}
                                    <NavLink to={ROUTE_PATH.TRASH}>
                                        <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 cursor-pointer">
                                            휴지통
                                        </DropdownMenuItem>
                                    </NavLink>
                                    {/* <DropdownMenuSeparator className="h-0.5 bg-gray-100 opacity-100" /> */}
                                    <DropdownMenuItem className="flex justify-center py-2 text-base font-medium hover:bg-blue-50 text-red-600 cursor-pointer">
                                        로그아웃
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
