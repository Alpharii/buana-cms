// app/routes/index.tsx
import { useEffect } from 'react'
import { useNavigate } from '@remix-run/react'

export const meta = () => [
  { title: "Bintang Buana CMS" },
  { name: "description", content: "Bintang Buana CMS - Redirecting..." },
]

export default function Index() {
  const navigate = useNavigate()

  return null // Tidak ada UI yang dirender
}