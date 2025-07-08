// app/routes/login.tsx
import { FormEvent } from 'react'
import { useAuthStore } from '~/store/authStore'

export default function LoginPage() {
  const { login, error, isLoading } = useAuthStore()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await login(email, password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}