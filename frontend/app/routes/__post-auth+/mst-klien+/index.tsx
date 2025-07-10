import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import apiClient from "~/lib/apiClient";
import { Button } from "~/components/ui/button";

type Klien = {
  id: number;
  nama_klien: string;
  jenis_usaha: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  email: string;
  nama_pic: string;
};

export const loader: LoaderFunction = async () => {
  const res = await apiClient.get("/klien");
  console.log('res',res)
  return json(res.data as Klien[]);
};

export default function KlienList() {
  const klien = useLoaderData<Klien[]>();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Master Klien</h1>
        <Link to="/mst-klien.create">
          <Button>Tambah Klien</Button>
        </Link>
      </div>
      <table className="w-full border">
        <thead className="bg-muted flex">
          <tr className="flex w-full">
            <th className="p-2 flex-1">Nama</th>
            <th className="p-2 flex-1">Usaha</th>
            <th className="p-2 flex-1">Toko</th>
            <th className="p-2 flex-1">PIC</th>
            <th className="p-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {klien.map((k) => (
            <tr key={k.id} className="flex w-full border-t">
              <td className="p-2 flex-1">{k.nama_klien}</td>
              <td className="p-2 flex-1">{k.jenis_usaha}</td>
              <td className="p-2 flex-1">{k.nama_toko}</td>
              <td className="p-2 flex-1">{k.nama_pic}</td>
              <td className="p-2 w-32 space-x-2">
                <Link to={`/mst-klien.${k.id}.edit`}>
                  <Button size="sm">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
