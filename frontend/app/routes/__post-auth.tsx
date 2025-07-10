import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PostauthSidebar } from "~/components/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { tokenCookie } from "./__pre-auth+/login";
import { setApiToken } from "~/lib/apiClient";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie")
  const token = await tokenCookie.parse(cookie)

  if (!token) return redirect("/login")

  setApiToken(token)
  return null
}

export default function PostauthLayout() {
  return (
    <SidebarProvider>
      <PostauthSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
