import { useState } from "react"
import { ActionFunction, LoaderFunction, json } from "@remix-run/node"
import { useLoaderData, Form, useSubmit } from "@remix-run/react"
import { apiClient } from "~/lib/apiClient"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Trash2, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  // Ambil query params dari URL
  const start = url.searchParams.get("start")
  const end = url.searchParams.get("end")

  // Misal user_id disimpan di session / token
  // Untuk contoh, ambil dari query "?user_id="
  const userId = url.searchParams.get("user_id") || "1" // default id 1

  // === GET PROFILE ===
  const profileRes = await apiClient.get(`/profile/${userId}`)
  const profile = profileRes.data

  // === GET SALES ORDER (optional filter tanggal) ===
  let endpoint = "/sales-order"
  if (start && end) {
    endpoint += `?start=${start}&end=${end}`
  }

  const salesRes = await apiClient.get(endpoint)
  const sales = salesRes.data

  // gabungkan agar bisa diakses bersamaan di komponen
  return json({ profile, sales })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const id = formData.get("id")

  if (request.method.toLowerCase() === "post" && id) {
    try {
      await apiClient.delete(`/sales-order/${id}`)
      return json({ success: true })
    } catch {
      return json({ error: "Gagal menghapus order" }, { status: 500 })
    }
  }
  return json({ error: "Permintaan tidak valid" }, { status: 400 })
}

export default function MyProfile() {
  const { profile, sales } = useLoaderData<{ profile: any; sales: any[] }>()

  const user = {
    email: profile.email,
    username: profile.username,
    first_name: profile.first_name,
    last_name: profile.last_name,
    company: profile.company,
    profile_picture: profile.profile_picture,
  }

  const data = sales

  console.log('user',user)


  const [expanded, setExpanded] = useState<number | null>(null)
  const submit = useSubmit()

  // total semua sales
  const totalSales = data.reduce((sum, order) => sum + order.total_harga, 0)

  // filter handler
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const start = (form.elements.namedItem("start") as HTMLInputElement).value
    const end = (form.elements.namedItem("end") as HTMLInputElement).value
    submit({ start, end }, { method: "get" })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
  
{/* 
<Card className="shadow-md border border-border/40 relative">
  <CardHeader className="flex flex-row items-center gap-4">
    <Avatar className="h-16 w-16">
      <AvatarImage src={user?.profile?.profile_picture} />
      <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
    </Avatar>

    <div className="flex-1">
      <CardTitle className="text-lg font-semibold">
        {user?.email}
      </CardTitle>
      <CardDescription>
        {user?.profile?.first_name || user?.first_name || "(Belum diisi)"}{" "}
        {user?.profile?.last_name || user?.last_name || ""}
      </CardDescription>

      <div className="mt-2 text-sm space-y-1 text-muted-foreground">
        <p><span className="font-medium text-foreground">Username:</span> {user?.username || "-"}</p>
        <p><span className="font-medium text-foreground">Perusahaan:</span> {user?.profile?.company || "-"}</p>
      </div>
    </div>

    <Form method="get" action="/profile/edit">
      <Button variant="outline" size="sm">
        Edit Profil
      </Button>
    </Form>
  </CardHeader>
</Card>
 */}

      <Separator />

      {/* === FILTER + TOTAL === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Form onSubmit={handleFilter} className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input type="date" name="start" className="border rounded px-2 py-1 text-sm" />
          <span>to</span>
          <input type="date" name="end" className="border rounded px-2 py-1 text-sm" />
          <Button type="submit" size="sm">Filter</Button>
        </Form>

        <div className="text-right">
          <p className="text-muted-foreground text-sm">Total Penjualan</p>
          <p className="text-lg font-semibold text-foreground text-green-600">
            Rp {totalSales.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <Separator />

      {/* === SALES ORDER LIST === */}
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Tidak ada sales order untuk rentang tanggal ini.
          </p>
        ) : (
          data.map((order) => {
            const isOpen = expanded === order.ID
            console.log('order',order)
            return (
              <Card
                key={order.ID}
                className="border border-border/40 hover:shadow-md transition"
              >
                <CardHeader
                  onClick={() => setExpanded(isOpen ? null : order.ID)}
                  className="cursor-pointer flex flex-row items-center justify-between"
                >
                  <div>
                    <CardTitle>{order.Klien.nama_toko} - {order.Klien.nama_klien}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-">
                      {format(new Date(order.tanggal), "dd MMM yyyy")} — Rp{" "}
                      {order.total_harga.toLocaleString("id-ID")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Form method="post" onClick={(e) => e.stopPropagation()}>
                      <input type="hidden" name="id" value={order.ID} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Form>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="animate-in fade-in slide-in-from-top-1 space-y-4">
                    {/* === ITEM DETAIL === */}
                    <div className="border rounded-lg divide-y mt-2">
                      {order.items.map((item: any) => (
                        <div
                          key={item.ID}
                          className="flex items-center justify-between p-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{item.Barang.nama_barang}</p>
                            <p className="text-muted-foreground">
                              {item.jumlah} × Rp{" "}
                              {item.harga_satuan.toLocaleString("id-ID")} (
                              {item.Barang.satuan})
                            </p>
                          </div>
                          <span className="font-semibold text-green-600">
                            Rp {item.subtotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* === ORDER SUMMARY === */}
                    <div className="border rounded-lg bg-muted/30 p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tanggal Order</span>
                        <span>{format(new Date(order.tanggal), "dd MMM yyyy")}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PIC Klien</span>
                        <span className="font-medium">{order.Klien?.nama_pic ?? "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nama Toko</span>
                        <span>{order.Klien?.nama_toko ?? "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email Klien</span>
                        <span>{order.Klien?.email ?? "-"}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border/40">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === "done"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status?.toUpperCase() ?? "-"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/40 pt-2">
                        <span className="font-semibold">Total Harga</span>
                        <span className="text-lg font-bold text-green-700">
                          Rp {order.total_harga.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}

              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
