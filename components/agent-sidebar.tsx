"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Home, FileText, Users, Bell, DollarSign, MessageSquare, LogOut, User, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "لوحة التحكم", href: "/agentdash", icon: Home },
  { name: "الطلاب", href: "/agentdash/students", icon: Users },
  { name: "المدفوعات", href: "/agentdash/payments", icon: DollarSign },
  { name: "تذاكر الدعم", href: "/agentdash/tickets", icon: Ticket },
  { name: "التواصل مع الإدارة", href: "/agentdash/admin", icon: MessageSquare },
  { name: "الإشعارات", href: "/agentdash/notifications", icon: Bell, showBadge: true },
]

export function AgentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user?.role === 'agent') {
      fetchUnreadCount()
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/agent/notes')
      if (response.ok) {
        const data = await response.json()
        const unread = (data.notes || []).filter((note: any) => !note.isRead).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="w-64 bg-[#374151] text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-white rounded text-[#374151] flex items-center justify-center text-sm font-bold">
          SM
        </div>
        <span className="font-semibold">لوحة تحكم الوكيل</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors relative",
                isActive ? "bg-[#4b5563] text-white" : "hover:bg-[#4b5563] cursor-pointer",
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.name}</span>
              {item.showBadge && unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#4b5563] space-y-3">
        {session?.user && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="font-medium">{session.user.name}</span>
              <span className="text-xs text-gray-300">{session.user.role === 'agent' ? 'وكيل' : session.user.role}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4" />
          <span>الإشعارات</span>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-white hover:bg-[#4b5563] hover:text-white"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  )
}
