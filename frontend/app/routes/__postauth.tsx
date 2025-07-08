// app/routes/__postauth.tsx
import { Outlet } from '@remix-run/react'

export default function PostAuthLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 border-r p-4 bg-background hidden md:block">
        <nav className="space-y-2">
          <a href="/dashboard" className="block py-2 px-3 rounded hover:bg-accent">
            Dashboard
          </a>
          <a href="/profile" className="block py-2 px-3 rounded hover:bg-accent">
            Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b h-16 flex items-center px-6 bg-background">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-bold">Bintang Buana CMS</h1>
            <a
              href="/logout"
              className="text-sm px-4 py-2 rounded-md border border-input bg-transparent hover:bg-accent"
            >
              Logout
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}