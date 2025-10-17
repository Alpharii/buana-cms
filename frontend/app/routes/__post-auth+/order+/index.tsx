import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Link, useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import { Plus, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { apiClient } from "~/lib/apiClient";

// === Type definitions ===
type Barang = {
  nama_barang: string;
  satuan: string;
  harga: number;
};

type Item = {
  ID: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  Barang: Barang;
};

type Klien = {
  nama_klien: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  email: string;
  nama_pic: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  profile: any;
};


type Order = {
  ID: number;
  no_order: string;
  tanggal: string;
  total_harga: number;
  status: string;
  klien?: Klien;
  items?: Item[];
  user?: User;
};

// === Loader & Action ===
export const loader: LoaderFunction = async () => {
  const res = await apiClient.get("/sales-order");
  return json(res.data);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  if (request.method.toLowerCase() === "post" && id) {
    try {
      await apiClient.delete(`/sales-order/${id}`);
      return json({ success: true });
    } catch (error) {
      return json({ error: "Gagal menghapus order" }, { status: 500 });
    }
  }
  return json({ error: "Permintaan tidak valid" }, { status: 400 });
};

// === Main component ===
export default function OrderList() {
  const orders = useLoaderData<Order[]>();
  const fetcher: any = useFetcher();
  const navigate = useNavigate();
  console.log('orders', orders)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (fetcher.data?.error) toast.error(fetcher.data.error);
    if (fetcher.data?.success) {
      toast.success("Order berhasil dihapus");
      navigate("/order");
    }
  }, [fetcher.data]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sales Order</h1>
        <Link to="/order/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Order
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-muted text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">No Order</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Klien</th>
              <th className="px-4 py-3">Total Harga</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Dibuat Oleh</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.ID} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{o.no_order}</td>
                  <td className="px-4 py-3">
                    {new Date(o.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3">{o.klien?.nama_klien || "-"}</td>
                  <td className="px-4 py-3">
                    Rp {o.total_harga.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                  <td className="px-4 py-3 capitalize">{(o.user?.profile?.firstname + o.user?.profile?.lastname || o.user?.username) || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {/* === Tombol Detail === */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(o);
                          setOpenDetail(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>

                      {/* === Tombol Edit === */}
                      <Link to={`/order/${o.ID}/edit`}>
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                      </Link>

                      {/* === Tombol Hapus === */}
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
                            <AlertDialogTitle>
                              Yakin ingin menghapus?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Data order <strong>{o.no_order}</strong> akan
                              dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <fetcher.Form method="post">
                              <input type="hidden" name="id" value={o.ID} />
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
                <td colSpan={6} className="text-center py-6 text-muted-foreground">
                  Tidak ada data order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* === Modal Detail Order === */}
        <Dialog open={openDetail} onOpenChange={setOpenDetail}>
            <DialogContent className="max-w-3xl p-6">
                <DialogHeader className="border-b pb-3">
                <DialogTitle className="text-xl font-bold">Detail Sales Order</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Informasi lengkap mengenai pesanan dan item yang dipesan oleh klien.
                </DialogDescription>
                </DialogHeader>

                {selectedOrder && (
                <div className="mt-4 space-y-6">
                    {/* === Informasi Order === */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1.5">
                        <p><span className="font-medium text-muted-foreground">No Order:</span> {selectedOrder.no_order}</p>
                        <p><span className="font-medium text-muted-foreground">Tanggal:</span> {new Date(selectedOrder.tanggal).toLocaleDateString("id-ID")}</p>
                        <p><span className="font-medium text-muted-foreground">Status:</span> <span className="capitalize">{selectedOrder.status}</span></p>
                        <p><span className="font-medium text-muted-foreground">PIC:</span> {selectedOrder.klien?.nama_pic || "-"}</p>
                    </div>

                    <div className="space-y-1.5">
                        <p><span className="font-medium text-muted-foreground">Klien:</span> {selectedOrder.klien?.nama_klien}</p>
                        <p><span className="font-medium text-muted-foreground">Toko:</span> {selectedOrder.klien?.nama_toko}</p>
                        <p><span className="font-medium text-muted-foreground">Email:</span> {selectedOrder.klien?.email}</p>
                        <p><span className="font-medium text-muted-foreground">No. Telepon:</span> {selectedOrder.klien?.no_telepon}</p>
                    </div>
                    </div>

                    {/* === Tabel Barang === */}
                    <div>
                    <h3 className="text-base font-semibold mb-3 border-b pb-1.5">Daftar Barang</h3>
                    <div className="overflow-x-auto rounded-md border">
                        <table className="w-full text-sm border-collapse">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                            <th className="border px-3 py-2 text-left font-medium">Barang</th>
                            <th className="border px-3 py-2 text-center font-medium">Jumlah</th>
                            <th className="border px-3 py-2 text-right font-medium">Harga Satuan</th>
                            <th className="border px-3 py-2 text-right font-medium">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.items?.length ? (
                            selectedOrder.items.map((item) => (
                                <tr key={item.ID} className="hover:bg-muted/50">
                                <td className="border px-3 py-2">{item.Barang?.nama_barang}</td>
                                <td className="border px-3 py-2 text-center">{item.jumlah}</td>
                                <td className="border px-3 py-2 text-right">
                                    Rp {item.harga_satuan.toLocaleString("id-ID")}
                                </td>
                                <td className="border px-3 py-2 text-right font-medium">
                                    Rp {item.subtotal.toLocaleString("id-ID")}
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td
                                colSpan={4}
                                className="text-center py-4 text-muted-foreground italic"
                                >
                                Tidak ada item dalam pesanan ini.
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>

                    <div className="text-right mt-3">
                        <span className="text-base font-semibold">
                        Total: Rp {selectedOrder.total_harga.toLocaleString("id-ID")}
                        </span>
                    </div>
                    </div>
                </div>
                )}

                {/* === Footer Aksi === */}
                <DialogFooter className="border-t pt-6 flex justify-between">
                <Button
                    variant="default"
                    onClick={() => toast.success("Invoice berhasil dibuat!")}
                    className="font-medium"
                >
                    Buat Invoice
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => setOpenDetail(false)}
                >
                    Tutup
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}
