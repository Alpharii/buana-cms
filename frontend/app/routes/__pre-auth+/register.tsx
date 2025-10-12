import { FormEvent, useState } from "react"
import { useNavigate, Link } from "@remix-run/react"
import { apiClient } from "~/lib/apiClient"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await apiClient.post("/users/register", { username: name, email, password })
      toast.success("Registrasi Berhasil", {
        description: "Silakan masuk dengan akun Anda.",
      })
      navigate("/login")
    } catch (err: any) {
      const message = err.response?.data?.message || "Registrasi gagal"
      toast.error("Gagal Mendaftar", {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
          <CardDescription>Isi data berikut untuk mendaftar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative bg-white">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nama Anda"
                  required
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative bg-white">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
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
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </form>


          <div className="text-center mt-4 text-sm text-gray-600">
            <form method="post" action="/login">
              Sudah punya akun?{" "}
              <button type="submit" className="text-blue-600 hover:underline font-medium">
                Login disini
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
