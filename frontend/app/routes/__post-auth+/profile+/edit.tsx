import { json, redirect, type LoaderFunction, type ActionFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData, useNavigation, useActionData, useNavigate } from "@remix-run/react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { toast } from "sonner"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "~/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { apiClient, setApiToken } from "~/lib/apiClient"
import { tokenCookie } from "~/routes/__pre-auth+/login+/server"

type ProfileForm = {
  first_name: string
  last_name: string
  company: string
  profile_picture: string
}

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

export default function EditProfilePage() {
  const { profile, email, username } = useLoaderData<any>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const { register, reset } = useForm<ProfileForm>({
    defaultValues: profile,
  })
  const actionData: any = useActionData<typeof action>()
  const navigate = useNavigate()

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error)
    }

    if (actionData?.success) {
      toast.success("Profil berhasil diperbarui")
      navigate("/profile/my-profile")
    }
  }, [actionData, navigate])

  const avatarLetter =
    profile?.first_name?.[0]?.toUpperCase() ||
    username?.[0]?.toUpperCase() ||
    "U"

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>

      <Card className="shadow-sm border border-border/40">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profile_picture} />
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
              <Label>URL Foto Profil</Label>
              <Input
                type="url"
                {...register("profile_picture")}
                placeholder="https://contoh.com/avatar.jpg"
              />
              {profile.profile_picture && (
                <img
                  src={profile.profile_picture}
                  alt="preview"
                  className="w-20 h-20 mt-2 rounded-md object-cover border"
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
