import type React from "react"
import { AgentSidebar } from "@/components/agent-sidebar"

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AgentSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
