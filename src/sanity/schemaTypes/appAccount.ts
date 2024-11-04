import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "appAccount",
  title: "App Account",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Nama Lengkap",
      type: "string",
    }),
    { name: "email", title: "Email", type: "string" },
    {
      name: "hashedPassword",
      title: "Hashed Password",
      type: "string",
      readOnly: true,
    },
    {
      name: "nik",
      title: "Nomor Induk Kependudukan (NIK)",
      type: "number",
      readOnly: true,
      description:
        "NIK digunakan untuk mengakses layanan pemerintah, termasuk kesehatan.",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Mother", value: "mother" },
          { title: "Health Officer", value: "health_officer" },
        ],
      },
      description: "Pilih apakah Anda ibu atau petugas kesehatan.",
    },
    {
      name: "pregnancyStartDate",
      title: "Tanggal Kehamilan Mulai",
      type: "date",
      description:
        "Tanggal perkiraan dimulainya kehamilan untuk perhitungan usia kehamilan.",
      hidden: ({ document }) => document?.role !== "mother",
    },
    {
      name: "isPregnant",
      title: "Sedang Hamil?",
      type: "boolean",
      description: "Centang jika pengguna sedang hamil.",
      hidden: ({ document }) => document?.role !== "mother",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      description: "Tanggal pendaftaran akun.",
    },
    {
      name: "children",
      title: "Anak-Anak",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "child",
          title: "anak",
          fields: [
            defineField({ name: "name", title: "Nama Anak", type: "string" }),
            { name: "birthDate", title: "Tanggal Lahir", type: "date" },
            {
              name: "gender",
              title: "Jenis Kelamin",
              type: "string",
              options: {
                list: [
                  { title: "Laki-Laki", value: "male" },
                  { title: "Perempuan", value: "female" },
                ],
              },
            },
            {
              name: "allergies",
              title: "Alergi",
              type: "array",
              of: [{ type: "string" }],
              description:
                "Daftar alergi jika ada, untuk rekomendasi nutrisi yang lebih akurat.",
            },
            {
              name: "notes",
              title: "Catatan Tambahan",
              type: "text",
              description:
                "Catatan khusus mengenai anak, misalnya kondisi kesehatan atau preferensi lain.",
            },
          ],
        }),
      ],
      description:
        "Informasi anak-anak yang akan dipantau perkembangan kesehatannya.",
    },
    {
      name: "assignedRegion",
      title: "Wilayah Tugas",
      type: "string",
      description:
        "Wilayah tugas bagi petugas kesehatan untuk melacak perkembangan bayi di area tertentu.",
      hidden: ({ document }) => document?.role !== "health_officer",
    },
    defineField({
      name: "isProfileComplete",
      title: "Informasi Profil Lengkap",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
