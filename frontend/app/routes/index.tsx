import { LoaderFunction, redirect } from "@remix-run/node"
import { setApiToken } from "~/lib/apiClient"
import { tokenCookie } from "./__pre-auth+/login+/server"

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie")
  const token = await tokenCookie.parse(cookie)
  if (!token) return redirect("/login")
  setApiToken(token)

  return redirect("/dashboard")
}