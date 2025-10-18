// app/lib/apiClient.ts
import axios from "axios"

let authToken: string | null = null

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:3000/api",
  timeout: 10_000,
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Fungsi global untuk mengatur token
export function setApiToken(token: string) {
  authToken = token
}
