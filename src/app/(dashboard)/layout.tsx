import { AppSidebar } from '@/components/shared/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-2 md:p-4 border-b flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg">SmartQuest AI</h1>
        </div>
        <div className="p-2 md:p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
