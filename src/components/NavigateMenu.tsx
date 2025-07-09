import { memo } from "react";
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
import { usePageStore } from "@/stores/useNavigateStore";
import "@styles/NavMenu.css";
import { PageRenderer } from "@/handlers/protoPage.renderer.handler";
import ProtoPage1 from "@/components/ProtoPage1";
import ProtoPage3 from "@/components/ProtoPage3";
import ProtoPage2 from "@/components/ProtoPage2";

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
                    CTM
                </a>
                <NavigationMenu className="navMenu">
                    <NavigationMenuList className="navList">
                        <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage(ProtoPage1)}>저장소</NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage(ProtoPage2)}>복구</NavigationMenuLink>
                        </NavigationMenuItem> */}

                        <NavigationMenuItem>
                            <NavigationMenuLink className="navLink" onClick={() => setActivePage(ProtoPage3)}>대시보드</NavigationMenuLink>
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
                <div className="pageContainer">
                    <PageRenderer />
                </div>
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

