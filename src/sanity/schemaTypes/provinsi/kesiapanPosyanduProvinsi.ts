import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "kesiapanPosyanduProvinsi",
  title: "Data Kesiapan Posyandu per Provinsi per Bulan",
  type: "document",
  fields: [
    defineField({
      name: "provinsi",
      title: "Provinsi",
      type: "string",
    }),
    {
      name: "tahun",
      title: "Tahun",
      type: "number",
      initialValue: 2024,
    },

    { name: "bulan", title: "Bulan (1-12)", type: "number" },
    {
      name: "jumlahPosyandu",
      title: "Jumlah Posyandu EPPGBM",
      type: "number",
    },
    {
      name: "posyanduAktif",
      title: "Jumlah Posyandu Aktif EPPGBM",
      type: "number",
    },
    {
      name: "persentaseAntropometri",
      title: "Jumlah Balita diukur (EPPGBM)",
      type: "number",
    },
    {
      name: "ketersediaanAntropometri",
      title: "Persentase Balita diukur (Data BPS)",
      type: "number",
    },
  ],
});
