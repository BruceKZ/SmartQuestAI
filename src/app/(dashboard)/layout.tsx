import { TopNav } from '@/components/shared/top-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 container mx-auto max-w-7xl py-6 px-4 md:px-6">
        {children}
      </main>
    </div>
  )
}
