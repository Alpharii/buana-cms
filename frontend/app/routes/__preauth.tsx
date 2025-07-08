// app/routes/__preauth.tsx
import { Outlet } from '@remix-run/react'

export default function PreAuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted-foreground/5 px-4">
      <main className="w-full max-w-md">
        <Outlet />
      </main>
    </div>
  )
}