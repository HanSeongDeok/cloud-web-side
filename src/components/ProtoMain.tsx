import { memo, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProtoPage1 from "./ProtoPage1";
import ProtoPage2 from "./ProtoPage2";
import ProtoPage3 from "./ProtoPage3";
import { SidebarTrigger, useSidebar, SidebarProvider } from "./ui/sidebar";
import Layout from "@/layout";

const ProtoMainContent = memo(() => {
    const [activePage, setActivePage] = useState<"page1" | "page2" | "page3" | null>(null);
    const { open } = useSidebar();

    const renderPage = () => {
        switch (activePage) {
            case "page1":
                return <ProtoPage1 />;
            case "page2":
                return <ProtoPage2 />;
            case "page3":
                return <ProtoPage3 />;
            default:
                return <ProtoPage1 />;
        }
    };

    return (
        <div className="w-full">
            <nav className="fixed top-0 left-0 w-full bg-background shadow-md z-50 px-6 py-3 border-b border-border flex items-center">
                <SidebarTrigger
                    style={{
                        transform: `translateX(${open ? '240px' : '0px'})`,
                        transition: 'transform 0.2s ease-in-out',
                    }}
                    className="mr-3 w-10 h-10"
                />
                <a href="/" className="text-3xl font-semibold text-blue-800 underline">
                    Service name
                </a>
                <NavigationMenu className="ml-auto">
                    <NavigationMenuList className="flex items-center gap-6">
                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg cursor-pointer" onClick={() => setActivePage("page1")}>저장소</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg cursor-pointer" onClick={() => setActivePage("page2")}>복구</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-lg cursor-pointer" onClick={() => setActivePage("page3")}>대시보드</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="font-medium px-2 py-1 hover:underline">
                                관리자
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <div className="flex items-center gap-1 text-sm text-gray-300">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="" alt="@user" />
                                    <AvatarFallback>O</AvatarFallback>
                                </Avatar>
                                <span>OO팀/홍길동</span>
                            </div>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
            <main className="pt-20 px-4">
                {renderPage()}
            </main>
        </div>
    );
});

const ProtoMain = memo(() => {
    return (
        <SidebarProvider>
            <Layout>
                <ProtoMainContent />
            </Layout>
        </SidebarProvider>
    );
});

export default ProtoMain;

