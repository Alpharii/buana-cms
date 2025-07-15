import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { apiClient } from "~/lib/apiClient";
import { useEffect } from "react";
import { toast } from "sonner";

type FormData = {
  nama: string;
  deskripsi: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as FormData;

  try {
    await apiClient.post("/kategori", data);
    return json({ success: true });
  } catch (error: any) {
    console.error("Gagal tambah kategori:", error);
    return json({ error: "Gagal menambahkan kategori" }, { status: 400 });
  }
};

export default function TambahKategoriPage() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const actionData: any = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }

    if (actionData?.success) {
      toast.success("Kategori berhasil ditambahkan");
      reset();
      navigate("/mst-category");
    }
  }, [actionData, reset]);

  return (
    <div className="max-w-3xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Tambah Kategori</h1>
      <Form method="post" className="space-y-4">
        <div>
          <Label>Nama</Label>
          <Input {...register("nama")} required />
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Input {...register("deskripsi")} required />
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
