import { SidebarProvider } from "@/components/ui/sidebar"

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <main>
        <div className="w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}