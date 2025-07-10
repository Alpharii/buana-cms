import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { apiClient } from "~/lib/apiClient";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog";
import { useEffect } from "react";
import { toast } from "sonner";

type Klien = {
  ID: number;
  nama_klien: string;
  jenis_usaha: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  email: string;
  nama_pic: string;
};

export const loader: LoaderFunction = async () => {
  try {
    const res = await apiClient.get("/klien");
    return json(res.data);
  } catch (error: any) {
    console.error("Gagal fetch klien:", error);
    throw new Response("Gagal mengambil data", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (request.method.toLowerCase() === "post" && id) {
    try {
      await apiClient.delete(`/klien/${id}`);
      return json({ success: true });
    } catch (error) {
      console.error("Gagal menghapus klien:", error);
      return json({ error: "Gagal menghapus klien" }, { status: 500 });
    }
  }

  return json({ error: "Permintaan tidak valid" }, { status: 400 });
};

export default function KlienList() {
  const klien = useLoaderData<Klien[]>();
  const fetcher: any = useFetcher();
  const navigate = useNavigate()

    useEffect(() => {
    if (fetcher.data?.error) {
        toast.error(fetcher.data.error);
    }

    if (fetcher.data?.success) {
        toast.success("Klien berhasil dihapus");
        navigate('/mst-klien')
    }
    }, [fetcher.data]);

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
                <tr key={k.ID} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{k.nama_klien}</td>
                  <td className="px-4 py-3">{k.jenis_usaha}</td>
                  <td className="px-4 py-3">{k.nama_toko}</td>
                  <td className="px-4 py-3">{k.nama_pic}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/mst-klien/${k.ID}/edit`}>
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
                              Data klien <strong>{k.nama_klien}</strong> akan dihapus secara permanen.
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
