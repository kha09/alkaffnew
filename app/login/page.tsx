"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة")
        setIsLoading(false)
        return
      }

      // Get the session to determine user role
      const session = await getSession()
      
      if (session?.user?.role) {
        // Redirect based on user role
        switch (session.user.role) {
          case "admin":
            router.push("/dashboard")
            break
          case "agent":
            router.push("/agentdash")
            break
          case "student":
            router.push("/student")
            break
          default:
            router.push("/")
        }
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("حدث خطأ أثناء تسجيل الدخول")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            ادخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم أو البريد الإلكتروني</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="ادخل اسم المستخدم أو البريد الإلكتروني"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="ادخل كلمة المرور"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>بيانات تجريبية للاختبار:</p>
            <div className="mt-2 space-y-1 text-xs">
              <p><strong>مدير:</strong> admin / admin123</p>
              <p><strong>وكيل:</strong> agent / agent123</p>
              <p><strong>طالب:</strong> student / student123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
