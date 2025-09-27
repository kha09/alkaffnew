"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, FileText, Settings, DollarSign, Bell } from "lucide-react"

const agentNavigation = [
  { name: "لوحة الوكيل", href: "/agentdash", icon: Home },
  { name: "إدارة الطلاب", href: "/agentdash/students", icon: Users },
  { name: "متابعة الطلبات", href: "/agentdash/orders", icon: FileText },
  { name: "الأدمن", href: "/agentdash/admin", icon: Settings },
  { name: "العمولات والمدفوعات", href: "/agentdash/payments", icon: DollarSign },
  { name: "الإشعارات", href: "/agentdash/notifications", icon: Bell },
]

export function AgentSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#374151] text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-white rounded text-[#374151] flex items-center justify-center text-sm font-bold">
          AG
        </div>
        <span className="font-semibold">لوحة الوكيل</span>
      </div>

      <nav className="space-y-2 flex-1">
        {agentNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isActive ? "bg-[#4b5563] text-white" : "hover:bg-[#4b5563] cursor-pointer",
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#4b5563]">
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4" />
          <span>الإشعارات</span>
        </div>
      </div>
    </div>
  )
}
