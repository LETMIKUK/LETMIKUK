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
      readOnly: true,
    }),
    {
      name: "tahun",
      title: "Tahun",
      type: "number",
      initialValue: 2024,
      readOnly: true,
    },

    { name: "bulan", title: "Bulan (1-12)", type: "number", readOnly: true },
    {
      name: "jumlahPosyandu",
      title: "Jumlah Posyandu EPPGBM",
      type: "number",
      readOnly: true,
    },
    {
      name: "posyanduAktif",
      title: "Jumlah Posyandu Aktif EPPGBM",
      type: "number",
      readOnly: true,
    },
    {
      name: "persentaseAntropometri",
      title: "Jumlah Balita diukur (EPPGBM)",
      type: "number",
      readOnly: true,
    },
    {
      name: "ketersediaanAntropometri",
      title: "Persentase Balita diukur (Data BPS)",
      type: "number",
      readOnly: true,
    },
  ],
});
