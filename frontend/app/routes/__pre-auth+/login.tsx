// app/routes/__preauth+/login.tsx
import {
  json,
  type ActionFunctionArgs,
  createCookie,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { useForm } from "react-hook-form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { LockKeyhole } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { redirect } from "@remix-run/node"
import { apiClient } from "~/lib/apiClient"

type FormInputs = {
  email: string
  password: string
}

export const tokenCookie = createCookie("token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  // secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24,
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")


  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Email dan password wajib diisi" }, { status: 400 })
  }

  try {
    const res = await apiClient.post("/users/login", { email, password })
    const token = res.data.token

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await tokenCookie.serialize(token),
      },
    })
  } catch (error: any) {
    console.log('error',error)
    const message = error.response?.data?.message || "Login gagal"
    return json({ error: message }, { status: 401 })
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const { register, handleSubmit } = useForm<FormInputs>()

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error)
    }
  }, [actionData?.error])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center space-y-1">
        <LockKeyhole className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="text-2xl font-semibold tracking-tight">Masuk ke Akun Anda</CardTitle>
        <p className="text-sm text-muted-foreground">Gunakan email & password Anda.</p>
      </CardHeader>
      <CardContent>
        <Form method="post" onSubmit={handleSubmit(() => {})} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} required />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
