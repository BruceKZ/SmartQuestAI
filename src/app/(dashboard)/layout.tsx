import { TopNav } from '@/components/shared/top-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}
