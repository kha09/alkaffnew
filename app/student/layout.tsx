import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <StudentSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
