import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000 ', // Ganti sesuai backend kamu
  timeout: 10_000, // 10 detik timeout
})

// Tambahkan interceptor jika butuh token otomatis
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // atau dari cookie/context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient


// contoh penggunaan
// import { json } from '@remix-run/node'
// import apiClient from '~/lib/apiClient'

// export async function loader() {
//   try {
//     const res = await apiClient.get('/user/me')
//     return json(res.data)
//   } catch (err) {
//     console.error(err)
//     throw new Response('Error fetching data', { status: 500 })
//   }
// }