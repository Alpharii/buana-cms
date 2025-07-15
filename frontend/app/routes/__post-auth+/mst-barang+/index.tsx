import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate, Link } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";
import { apiClient } from "~/lib/apiClient";

type Barang = {
  ID: number;
  nama_barang: string;
  harga: number;
  deskripsi: string;
  stok: number;
  satuan: string;
  kategori?: { nama: string };
};

export const loader: LoaderFunction = async () => {
  try {
    const res = await apiClient.get("/barang");
    return json(res.data);
  } catch (error) {
    console.error("Gagal fetch barang:", error);
    throw new Response("Gagal mengambil data", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (request.method.toLowerCase() === "post" && id) {
    try {
      await apiClient.delete(`/barang/${id}`);
      return json({ success: true });
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      return json({ error: "Gagal menghapus barang" }, { status: 500 });
    }
  }

  return json({ error: "Permintaan tidak valid" }, { status: 400 });
};

export default function BarangList() {
  const barang = useLoaderData<Barang[]>();
  const fetcher: any = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.error) toast.error(fetcher.data.error);
    if (fetcher.data?.success) {
      toast.success("Barang berhasil dihapus");
      navigate('/mst-barang');
    }
  }, [fetcher.data]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Master Barang</h1>
        <Link to="/mst-barang/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Barang
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-muted text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {barang.length > 0 ? (
              barang.map((b) => (
                <tr key={b.ID} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{b.nama_barang}</td>
                  <td className="px-4 py-3">{b.kategori?.nama ?? '-'}</td>
                  <td className="px-4 py-3">Rp {b.harga.toLocaleString()}</td>
                  <td className="px-4 py-3">{b.stok} {b.satuan}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/mst-barang/${b.ID}/edit`}>
                        <Button size="sm" variant="secondary">Edit</Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" /> Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Barang <strong>{b.nama_barang}</strong> akan dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <fetcher.Form method="post">
                              <input type="hidden" name="id" value={b.ID} />
                              <Button type="submit" variant="destructive">
                                Ya, Hapus
                              </Button>
                            </fetcher.Form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-6">Tidak ada data barang.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
