import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userEmail={session.user.email} userRole={session.user.role} />
      
      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
