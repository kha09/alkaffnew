"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, BarChart3, Users, Bell, FileEdit } from "lucide-react"

const navigation = [
  { name: "لوحة التحكم", href: "/dashboard", icon: Home },
  { name: "الطلبات", href: "/dashboard/orders", icon: FileText },
  { name: "التقارير والمعلومات", href: "/dashboard/reports", icon: BarChart3 },
  { name: "الوكلاء", href: "/dashboard/agents", icon: Users },
  { name: "الطلاب", href: "/dashboard/students", icon: Users },
  { name: "إدارة المحتوى", href: "/dashboard/content", icon: FileEdit },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#374151] text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-white rounded text-[#374151] flex items-center justify-center text-sm font-bold">
          SM
        </div>
        <span className="font-semibold">لوحة تحكم الكاف</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
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
