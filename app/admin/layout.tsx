import AdminGuard from './AdminGuard'
import { AdminLangProvider } from './adminI18n'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-deep text-cream">
      <AdminLangProvider>
        <AdminGuard>{children}</AdminGuard>
      </AdminLangProvider>
    </div>
  )
}
