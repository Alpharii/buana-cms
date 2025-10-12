import { json, redirect, createCookie, type ActionFunctionArgs } from "@remix-run/node"
import { apiClient } from "~/lib/apiClient"

export const tokenCookie = createCookie("token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,
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
    return redirect("/dashboard", {
      headers: { "Set-Cookie": await tokenCookie.serialize(token) },
    })
  } catch (error: any) {
    const message = error.response?.data?.error || "Login gagal"
    return json({ success: false, error: message }, { status: 401 })
  }
}
