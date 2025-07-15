import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate, Link } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";
import { apiClient } from "~/lib/apiClient";

type Kategori = {
  ID: number;
  nama: string;
  deskripsi: string;
};

export const loader: LoaderFunction = async () => {
  try {
    const res = await apiClient.get("/kategori");
    return json(res.data);
  } catch (error: any) {
    console.error("Gagal fetch kategori:", error);
    throw new Response("Gagal mengambil data", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (request.method.toLowerCase() === "post" && id) {
    try {
      await apiClient.delete(`/kategori/${id}`);
      return json({ success: true });
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      return json({ error: "Gagal menghapus kategori" }, { status: 500 });
    }
  }

  return json({ error: "Permintaan tidak valid" }, { status: 400 });
};

export default function KategoriList() {
  const kategori = useLoaderData<Kategori[]>();
  const fetcher: any = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }

    if (fetcher.data?.success) {
      toast.success("Kategori berhasil dihapus");
      navigate('/mst-category');
    }
  }, [fetcher.data]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Master Kategori</h1>
        <Link to="/mst-category/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-muted text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length > 0 ? (
              kategori.map((k) => (
                <tr key={k.ID} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{k.nama}</td>
                  <td className="px-4 py-3">{k.deskripsi}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/mst-category/${k.ID}/edit`}>
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Kategori <strong>{k.nama}</strong> akan dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <fetcher.Form method="post">
                              <input type="hidden" name="id" value={k.ID} />
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
              <tr>
                <td colSpan={3} className="text-center py-6 text-muted-foreground">
                  Tidak ada data kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
