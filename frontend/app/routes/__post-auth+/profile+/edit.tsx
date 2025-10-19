import {
  json,
  redirect,
  type LoaderFunction,
  type ActionFunctionArgs,
} from "@remix-run/node"
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  useNavigate,
} from "@remix-run/react"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "~/components/ui/card"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/components/ui/avatar"
import { apiClient, setApiToken } from "~/lib/apiClient"
import { tokenCookie } from "~/routes/__pre-auth+/login+/server"

type ProfileForm = {
  first_name: string
  last_name: string
  company: string
  profile_picture: string
}

//
// ✅ LOADER
//
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie")
  const token = await tokenCookie.parse(cookie)
  if (!token) return redirect("/login")

  setApiToken(token)
  try {
    const res = await apiClient.get("/profile/my-profile")
    return json(res.data)
  } catch (err) {
    console.error(err)
    throw new Response("Gagal mengambil data profil", { status: 500 })
  }
}

//
// ✅ ACTION (server-side Remix)
//
export const action = async ({ request }: ActionFunctionArgs) => {
  const cookie = request.headers.get("cookie")
  const token = await tokenCookie.parse(cookie)
  if (!token) return redirect("/login")

  setApiToken(token)
  const formData = await request.formData()
  const data = Object.fromEntries(formData) as ProfileForm

  try {
    await apiClient.put("/profile/me", data)
    return json({ success: true })
  } catch (err) {
    console.error("Gagal update profil:", err)
    return json({ error: "Gagal mengubah profil" }, { status: 400 })
  }
}

//
// ✅ KOMPONEN PAGE
//
export default function EditProfilePage() {
  const { profile, email, username } = useLoaderData<any>()
  const apiUrl = import.meta.env.VITE_API_URL
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const { register, setValue } = useForm<ProfileForm>({
    defaultValues: profile,
  })
  const actionData: any = useActionData<typeof action>()
  const navigate = useNavigate()
  const [preview, setPreview] = useState(apiUrl + profile.profile_picture || "")

  const avatarLetter =
    profile?.first_name?.[0]?.toUpperCase() ||
    username?.[0]?.toUpperCase() ||
    "U"

  // ✅ Notifikasi
  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error)
    if (actionData?.success) {
      toast.success("Profil berhasil diperbarui")
      navigate("/profile/my-profile")
    }
  }, [actionData, navigate])

  // ✅ Upload gambar ke backend (async)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await apiClient.post("/upload/temp-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const url = res.data.url
      setPreview(apiUrl + url)
      setValue("profile_picture", url)
      toast.success("Gambar berhasil diunggah")
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengunggah gambar")
    }
  }

  console.log(preview)

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>

      <Card className="shadow-sm border border-border/40">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={preview} />
            <AvatarFallback>{avatarLetter}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{email}</CardTitle>
            <CardDescription>
              {(profile.first_name || "(Belum diisi)")} {profile.last_name || ""}
            </CardDescription>

            <div className="mt-2 text-sm space-y-1 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Username:</span>{" "}
                {username || "-"}
              </p>
              <p>
                <span className="font-medium text-foreground">Perusahaan:</span>{" "}
                {profile.company || "-"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* ✅ Pakai Form Remix, bukan onSubmit */}
          <Form method="post" className="space-y-4">
            <div>
              <Label>Nama Depan</Label>
              <Input {...register("first_name")} placeholder="Masukkan nama depan" />
            </div>
            <div>
              <Label>Nama Belakang</Label>
              <Input {...register("last_name")} placeholder="Masukkan nama belakang" />
            </div>
            <div>
              <Label>Perusahaan</Label>
              <Input {...register("company")} placeholder="Nama perusahaan" />
            </div>

            <div>
              <Label>Foto Profil</Label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              {/* simpan url ke hidden input agar dikirim ke action */}
              <input type="hidden" {...register("profile_picture")} />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 mt-3 rounded-md object-cover border"
                />
              )}
            </div>

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
