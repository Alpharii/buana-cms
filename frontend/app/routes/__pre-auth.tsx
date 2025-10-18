import { Outlet } from "@remix-run/react"
import { useEffect } from "react"

export default function PreAuthLayout() {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <main className="w-full max-w-md animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
