// app/routes/__preauth+/login.tsx
import { Form, useActionData, useNavigation, Link } from "@remix-run/react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mail, Lock, Loader2 } from "lucide-react"
import type { action } from "./server" // 🟢 import type saja
import { toast } from "sonner"

type FormInputs = { email: string; password: string }

export { action } from "./server" // 🟢 ekspor ulang

export default function LoginPage() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const { register } = useForm<FormInputs>()

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Login Berhasil", {
        description: "Selamat datang kembali!",
      })

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } else if (actionData?.error) {
      toast.error("Gagal Masuk", {
        description: "Username atau password salah",
      })
    }
  }, [actionData])

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Masuk ke Akun Anda</CardTitle>
          <CardDescription>Gunakan email dan password Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative bg-white">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  required
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative bg-white">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  required
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </Form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
