import { json, redirect, type LoaderFunction, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useActionData, useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { apiClient, setApiToken } from "~/lib/apiClient";
import { useEffect } from "react";
import { toast } from "sonner";

type FormData = {
  nama_klien: string;
  jenis_usaha: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  email: string;
  nama_pic: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    const res = await apiClient.get(`/klien/${params.id}`);
    return json(res.data);
  } catch (err) {
    console.error(err);
    throw new Response("Gagal mengambil data klien", { status: 500 });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as FormData;

  try {
    await apiClient.put(`/klien/${params.id}`, data);
    return json({ success: true });
  } catch (err) {
    console.error("Gagal update:", err);
    return json({ error: "Gagal mengubah klien" }, { status: 400 });
  }
};

export default function EditKlienPage() {
  const klien = useLoaderData<FormData>();
  const navigation = useNavigation(); 
  const isSubmitting = navigation.state === "submitting";
  const { register, reset } = useForm<FormData>({ defaultValues: klien });
  const navigate = useNavigate();
  const actionData: any = useActionData<typeof action>();

    useEffect(() => {
    if (actionData?.error) {
        toast.error(actionData.error)
    }

    if (actionData?.success) {
        toast.success("Klien berhasil ditambahkan")
        reset()
        navigate("/mst-klien")
    }
    }, [actionData, reset])

  return (
    <div className="max-w-3xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Klien</h1>
      <Form method="post" className="space-y-4">
        <div>
          <Label>Nama Klien</Label>
          <Input {...register("nama_klien")} required />
        </div>
        <div>
          <Label>Jenis Usaha</Label>
          <Input {...register("jenis_usaha")} required />
        </div>
        <div>
          <Label>Nama Toko</Label>
          <Input {...register("nama_toko")} required />
        </div>
        <div>
          <Label>Alamat</Label>
          <Input {...register("alamat")} required />
        </div>
        <div>
          <Label>No. Telepon</Label>
          <Input {...register("no_telepon")} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} required />
        </div>
        <div>
          <Label>Nama PIC</Label>
          <Input {...register("nama_pic")} required />
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
