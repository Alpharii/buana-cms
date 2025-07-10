import { Outlet } from "@remix-run/react"

export default function PreAuthLayout() {
  return (
    <div className="min-h-screen bg-muted-foreground/5 flex items-center justify-center px-4">
      <main className="w-full max-w-md animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
