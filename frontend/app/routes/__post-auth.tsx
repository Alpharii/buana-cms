import { json, LoaderFunction, redirect } from "@remix-run/node"
import { Outlet, useLoaderData, Link } from "@remix-run/react"
import { PostauthSidebar } from "~/components/sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { apiClient, setApiToken } from "~/lib/apiClient"
import { tokenCookie } from "./__pre-auth+/login+/server"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie")
  const token = await tokenCookie.parse(cookie)
  if (!token) return redirect("/login")

  setApiToken(token)
  try {
    // 1️⃣ Ambil data user dasar
    const meRes = await apiClient.get("/users/me")

    // 2️⃣ Ambil data profil lengkap
    const profileRes = await apiClient.get("/profile/my-profile")

    return json({
      user: meRes.data,
      profile: profileRes.data,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return redirect("/login")
  }
}

export default function PostauthLayout() {
  const { user, profile } = useLoaderData<{ user: any; profile: any }>()
  const apiUrl = import.meta.env.VITE_API_URL
  const profilePicture = apiUrl + (profile?.profile?.profile_picture || "https://placehold.co/400x400")
  const avatarLetter =
    user?.email?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"

  return (
    <SidebarProvider>
      <PostauthSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4 justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Buana CMS</h1>
          </div>

          {/* === Avatar User di kanan atas === */}
          <Link
            to="/profile/my-profile"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Avatar className="h-9 w-9 border border-border/50">
              <AvatarImage src={profilePicture} alt="Profile" />
              <AvatarFallback>{avatarLetter}</AvatarFallback>
            </Avatar>
          </Link>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
