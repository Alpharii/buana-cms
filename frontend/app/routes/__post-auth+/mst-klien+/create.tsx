import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as FormData;
  try {
    await apiClient.post("/klien", data);
    return json({ success: true });
  } catch (error: any) {
    console.error("Gagal tambah klien:", error);
    return json({ error: "Gagal menambahkan klien" }, { status: 400 });
  }
};

export default function TambahKlienPage() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>();

  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
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
      <h1 className="text-2xl font-bold">Tambah Klien</h1>
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
                {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
            </div>
        </Form>
    </div>
    );
}
