import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { apiClient } from "~/lib/apiClient";
import { Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar as CalendarComp } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";

type Klien = {
  ID: number;
  nama_klien: string;
  nama_toko: string;
};

type Barang = {
  ID: number;
  nama_barang: string;
  harga: number;
};

type FormData = {
  no_order: string;
  tanggal: Date;
  klien_id: string;
  status: string;
  items: {
    barang_id: string;
    jumlah: number;
    harga_satuan: number;
  }[];
};

export const loader: LoaderFunction = async () => {
  const [klienRes, barangRes] = await Promise.all([
    apiClient.get("/klien"),
    apiClient.get("/barang"),
  ]);
  return json({
    klien: klienRes.data,
    barang: barangRes.data,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const parsedItems = JSON.parse(data.items as string).map((item: any) => ({
    barang_id: Number(item.barang_id),
    jumlah: Number(item.jumlah),
    harga_satuan: Number(item.harga_satuan),
  }));

  const payload = {
    no_order: data.no_order,
    tanggal: new Date(data.tanggal as string).toISOString(),
    user_id: 1,
    klien_id: Number(data.klien_id),
    status: data.status,
    items: parsedItems,
  };

  try {
    await apiClient.post("/sales-order", payload);
    return redirect("/order");
  } catch (error: any) {
    console.error("Gagal tambah sales order:", error);
    return json({ error: "Gagal menambahkan sales order" }, { status: 400 });
  }
};

export default function TambahSalesOrder() {
  const { klien, barang } = useLoaderData<{ klien: Klien[]; barang: Barang[] }>();
  const { register, handleSubmit, control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      status: "draft",
      items: [{ barang_id: "", jumlah: 1, harga_satuan: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const actionData: any = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const watchTanggal = watch("tanggal");
  const watchKlien = watch("klien_id");

  // 🔹 Auto-generate nomor order
  useEffect(() => {
    if (watchKlien) {
        const selectedKlien = klien.find((k) => String(k.ID) === watchKlien);
        const nama = selectedKlien?.nama_klien || "KLIEN";
        const cleanNama = nama.replace(/\s+/g, "").toUpperCase().slice(0, 3);

        // buat string unik acak (5 karakter)
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

        setValue("no_order", `SO-${cleanNama}${randomStr}`);
    }
  }, [watchKlien, klien, setValue]);

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
  }, [actionData]);

  const totalHarga = watch("items")?.reduce(
    (sum, i) => sum + (i.harga_satuan || 0) * (i.jumlah || 0),
    0
  );

  return (
    <div className="max-w-6xl px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Tambah Sales Order</h1>

      <Form
        method="post"
        onSubmit={handleSubmit((data) => {
          const payload = { ...data, items: JSON.stringify(data.items) };
          const form = document.createElement("form");
          Object.entries(payload).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.name = key;
            input.value =
              key === "tanggal" && value instanceof Date
                ? value.toISOString()
                : (value as string);
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.method = "post";
          form.submit();
        })}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informasi Sales Order</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informasi Umum */}
            <div className="grid grid-cols-1 mb-10 md:grid-cols-2 gap-5">
              <div>
                <Label>No. Order</Label>
                <Input {...register("no_order")} placeholder="Otomatis" readOnly />
              </div>

              <div>
                <Label>Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchTanggal && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watchTanggal ? (
                        format(watchTanggal, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComp
                      mode="single"
                      selected={watchTanggal}
                      onSelect={(date) => setValue("tanggal", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Klien</Label>
                <select
                  {...register("klien_id")}
                  className="border rounded-md w-full px-3 py-2 bg-white"
                  required
                >
                  <option value="">-- Pilih Klien --</option>
                  {klien.map((k) => (
                    <option key={k.ID} value={k.ID}>
                      {k.nama_klien}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  {...register("status")}
                  className="border rounded-md w-full px-3 py-2 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="approved">Delivered</option>
                  <option value="done">Paid</option>
                </select>
              </div>
            </div>

            {/* Daftar Barang */}
            <div className="pt-5 border-t">
              <h2 className="text-lg font-semibold mb-5">Daftar Barang</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="border px-3 py-2">Barang</th>
                      <th className="border px-3 py-2">Jumlah</th>
                      <th className="border px-3 py-2">Harga Satuan</th>
                      <th className="border px-3 py-2">Subtotal</th>
                      <th className="border px-3 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const item = watch(`items.${index}`);
                      return (
                        <tr key={field.id} className="hover:bg-muted/40">
                          <td className="border px-3 py-2">
                            <select
                              {...register(`items.${index}.barang_id` as const)}
                              className="border rounded-md w-full px-2 py-1 bg-white"
                              required
                              onChange={(e) => {
                                const selected = barang.find(
                                  (b) => b.ID === Number(e.target.value)
                                );
                                if (selected)
                                  setValue(
                                    `items.${index}.harga_satuan`,
                                    selected.harga
                                  );
                              }}
                            >
                              <option value="">-- Pilih Barang --</option>
                              {barang.map((b) => (
                                <option key={b.ID} value={b.ID}>
                                  {b.nama_barang}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border px-3 py-2">
                            <Input
                              type="number"
                              min="1"
                              {...register(`items.${index}.jumlah` as const, {
                                valueAsNumber: true,
                              })}
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <Input
                              type="number"
                              {...register(`items.${index}.harga_satuan` as const, {
                                valueAsNumber: true,
                              })}
                            />
                          </td>
                          <td className="border px-3 py-2 text-right">
                            Rp {(item.jumlah * item.harga_satuan || 0).toLocaleString()}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({ barang_id: "", jumlah: 1, harga_satuan: 0 })
                  }
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Tambah Barang
                </Button>

                <div className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-green-600">
                    Rp {totalHarga.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Order"}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
