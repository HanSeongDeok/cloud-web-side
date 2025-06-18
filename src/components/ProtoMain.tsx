import { memo} from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger, useSidebar, SidebarProvider } from "./ui/sidebar";
import Layout from "@/layout";
import { usePageStore } from "@/stores/usePageStore";
import { PageRenderer } from "@/handlers/PageRenderer";
import "@styles/ProtoMain.css";

const sidebarStyle = (open: boolean): React.CSSProperties => ({
    transform: `translateX(${open ? '380px' : '0px'})`,
    transition: 'transform 0.2s ease-in-out',
    outline: 'none',
  });

const ProtoMainContent = memo(() => {
    const { open } = useSidebar();
    const { setActivePage } = usePageStore();
    return (
        <div>
            <nav className="navContainer">
                <SidebarTrigger style={sidebarStyle(open)} className="sidebarTrigger" />
                <a href="/" className="serviceName">
                    Service name
                </a>
                <NavigationMenu className="navMenu">
                    <NavigationMenuList className="navList">
                        <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage("page1")}>저장소</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage("page2")}>복구</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage("page3")}>대시보드</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="adminTrigger">
                                관리자
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            {/* TODO 나중에 기능 추가할 때 컴포넌트 리소스로 분리해서 관리  */}
                            <div className="userInfo">
                                <Avatar className="avatar">
                                    <AvatarImage src="" alt="@user" />
                                    <AvatarFallback>O</AvatarFallback>
                                </Avatar>
                                <span>OO팀/홍길동</span>
                            </div>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
            <main className="mainContent">
                <PageRenderer />
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

