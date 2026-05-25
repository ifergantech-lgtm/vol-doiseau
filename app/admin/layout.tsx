import AdminGuard from './AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-deep text-cream">
      <AdminGuard>{children}</AdminGuard>
    </div>
  )
}
