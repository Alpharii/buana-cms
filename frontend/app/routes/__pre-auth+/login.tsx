import {
  json,
  type ActionFunctionArgs,
  createCookie,
  redirect,
} from "@remix-run/node"
import { Form, useActionData, useNavigation, Link } from "@remix-run/react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { apiClient } from "~/lib/apiClient"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mail, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

type FormInputs = {
  email: string
  password: string
}

export const tokenCookie = createCookie("token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24, // 1 hari
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ success: false, error: "Email dan password wajib diisi" }, { status: 400 })
  }

  try {
    const res = await apiClient.post("/users/login", { email, password })
    const token = res.data.token

    return json(
      { success: true },
      {
        headers: {
          "Set-Cookie": await tokenCookie.serialize(token),
        },
      }
    )
  } catch (error: any) {
    const message = error.response?.data?.error || "Login gagal"
    return json({ success: false, error: message }, { status: 401 })
  }
}

export default function LoginPage() {
  const actionData = useActionData<any>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const { register } = useForm<FormInputs>()

  //this toast not showing
  useEffect(() => {
    console.log('action', actionData)
    if (actionData?.success) {
      console.log('masuk')
      toast.success("Login Berhasil", {
        description: "Selamat datang kembali!",
      })

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } else if (actionData?.error) {
      toast.error("Gagal Masuk", {
        description: actionData.error,
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
          {/* Hapus handleSubmit kosong — biarkan Form Remix bekerja */}
          <Form method="post" replace preventScrollReset className="space-y-4">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
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
