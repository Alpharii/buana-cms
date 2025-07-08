// app/routes/index.tsx
import { useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import { useAuthStore } from '~/store/authStore'

export const meta = () => [
  { title: "Bintang Buana CMS" },
  { name: "description", content: "Bintang Buana CMS - Redirecting..." },
]

export default function Index() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  return null // Tidak ada UI yang dirender
}