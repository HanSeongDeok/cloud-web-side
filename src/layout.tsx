import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@components/SideBar"

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main>
        <div className="w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}