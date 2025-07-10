// app/routes/__preauth+/login.tsx
import { FormEvent } from "react"
import { useNavigate, Link } from "@remix-run/react"
import { useAuthStore } from "~/store/authStore"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { LockKeyhole } from "lucide-react"

export default function LoginPage() {
  const { login, error, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await login(email, password)

    if (!error) {
      toast.success("Berhasil login")
      navigate("/dashboard")
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center space-y-1">
        <LockKeyhole className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Masuk ke Akun Anda
        </CardTitle>
        <p className="text-sm text-muted-foreground">Gunakan email & password Anda.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" placeholder="••••••" required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="underline text-primary hover:text-primary/80">
            Daftar sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
