import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Plus } from "lucide-react";
import { apiClient } from "~/lib/apiClient";

type Klien = {
  id: number;
  nama_klien: string;
  jenis_usaha: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  email: string;
  nama_pic: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {

    const me = await apiClient.get("/users/me");
    console.log("me", me.data);

    const res = await apiClient.get("/klien");
    return json(res.data);
  } catch (error: any) {
    console.error("Gagal fetch user/klien:", error || error);
    throw new Response("Gagal mengambil data", { status: 500 });
  }
};
export default function KlienList() {
  const klien = useLoaderData<Klien[]>();
  console.log(klien)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Master Klien</h1>
        <Link to="/mst-klien/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Klien
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-muted text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jenis Usaha</th>
              <th className="px-4 py-3">Nama Toko</th>
              <th className="px-4 py-3">PIC</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {klien.length > 0 ? (
              klien.map((k) => (
                <tr key={k.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{k.nama_klien}</td>
                  <td className="px-4 py-3">{k.jenis_usaha}</td>
                  <td className="px-4 py-3">{k.nama_toko}</td>
                  <td className="px-4 py-3">{k.nama_pic}</td>
                  <td className="px-4 py-3">
                    <Link to={`/mst-klien/${k.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-muted-foreground">
                  Tidak ada data klien.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
