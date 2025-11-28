"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Home, FileText, CreditCard, HelpCircle, User, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "لوحة التحكم", href: "/student", icon: Home },
  { name: "الإشعارات", href: "/student/notifications", icon: Bell },
  { name: "المدفوعات", href: "/student/payments", icon: CreditCard },
  { name: "الدعم الفني", href: "/student/support", icon: HelpCircle },
  { name: "الملف الشخصي", href: "/student/profile", icon: User },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="w-64 bg-[#374151] text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-white rounded text-[#374151] flex items-center justify-center text-sm font-bold">
          SM
        </div>
        <span className="font-semibold">لوحة تحكم الطالب</span>
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

      <div className="mt-auto pt-4 border-t border-[#4b5563] space-y-3">
        {session?.user && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="font-medium">{session.user.name}</span>
              <span className="text-xs text-gray-300">{session.user.role === 'student' ? 'طالب' : session.user.role}</span>
            </div>
          </div>
        )}
        
        
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
