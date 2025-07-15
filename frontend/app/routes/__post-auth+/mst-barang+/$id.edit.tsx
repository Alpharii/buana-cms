import {
  json,
  type LoaderFunction,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { apiClient } from "~/lib/apiClient";
import { useEffect } from "react";
import { toast } from "sonner";

type FormData = {
  nama_barang: string;
  harga: number;
  deskripsi: string;
  stok: number;
  satuan: string;
  gambar: string;
  kategori_id: number;
};

type Kategori = {
  ID: number;
  nama: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const [barangRes, kategoriRes] = await Promise.all([
      apiClient.get(`/barang/${params.id}`),
      apiClient.get("/kategori"),
    ]);

    return json({
      barang: barangRes.data,
      kategoriList: kategoriRes.data,
    });
  } catch (err) {
    console.error("Gagal mengambil data:", err);
    throw new Response("Gagal mengambil data", { status: 500 });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const data = {
    nama_barang: raw.nama_barang,
    harga: parseFloat(raw.harga as string),
    deskripsi: raw.deskripsi,
    stok: parseInt(raw.stok as string),
    satuan: raw.satuan,
    gambar: raw.gambar,
    kategori_id: parseInt(raw.kategori_id as string),
  };

  try {
    await apiClient.put(`/barang/${params.id}`, data);
    return json({ success: true });
  } catch (err) {
    console.error("Gagal update:", err);
    return json({ error: "Gagal mengubah barang" }, { status: 400 });
  }
};

export default function EditBarangPage() {
  const { barang, kategoriList } = useLoaderData<{
    barang: FormData;
    kategoriList: Kategori[];
  }>();

  const { register, reset, setValue } = useForm<FormData>({
    defaultValues: barang,
  });

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();
  const actionData: any = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (actionData?.success) {
      toast.success("Barang berhasil diupdate");
      reset();
      navigate("/mst-barang");
    }
  }, [actionData, reset]);

  return (
    <div className="max-w-3xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Barang</h1>
      <Form method="post" className="space-y-4">
        <div><Label>Nama Barang</Label><Input {...register("nama_barang")} required /></div>
        <div><Label>Harga</Label><Input type="number" {...register("harga")} required /></div>
        <div><Label>Deskripsi</Label><Input {...register("deskripsi")} required /></div>
        <div><Label>Stok</Label><Input type="number" {...register("stok")} required /></div>
        <div><Label>Satuan</Label><Input {...register("satuan")} required /></div>
        <div><Label>Gambar</Label><Input {...register("gambar")} required /></div>
        <div>
          <Label>Kategori</Label>
          <Select
            defaultValue={barang.kategori_id.toString()}
            onValueChange={(val) => setValue("kategori_id", parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((kat) => (
                <SelectItem key={kat.ID} value={kat.ID.toString()}>
                  {kat.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("kategori_id", { valueAsNumber: true })} />
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
