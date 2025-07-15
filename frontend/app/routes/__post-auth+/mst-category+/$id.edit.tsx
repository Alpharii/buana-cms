import { json, type LoaderFunction, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useActionData, useNavigate } from "@remix-run/react";
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

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const res = await apiClient.get(`/kategori/${params.id}`);
    return json(res.data);
  } catch (err) {
    console.error(err);
    throw new Response("Gagal mengambil data kategori", { status: 500 });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as FormData;

  try {
    await apiClient.put(`/kategori/${params.id}`, data);
    return json({ success: true });
  } catch (err) {
    console.error("Gagal update:", err);
    return json({ error: "Gagal mengubah kategori" }, { status: 400 });
  }
};

export default function EditKategoriPage() {
  const kategori = useLoaderData<FormData>();
  const navigation = useNavigation(); 
  const isSubmitting = navigation.state === "submitting";
  const { register, reset } = useForm<FormData>({ defaultValues: kategori });
  const navigate = useNavigate();
  const actionData: any = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }

    if (actionData?.success) {
      toast.success("Kategori berhasil diperbarui");
      reset();
      navigate("/mst-category");
    }
  }, [actionData, reset]);

  return (
    <div className="max-w-3xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Kategori</h1>
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
            {isSubmitting ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
