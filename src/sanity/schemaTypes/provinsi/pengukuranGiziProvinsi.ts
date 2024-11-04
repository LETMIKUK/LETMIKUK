import { defineField, defineType } from "sanity";

export default defineType({
  name: "pengukuranGiziProvinsi",
  title: "Pengurukan Gizi Balita per Provinsi per Bulan",
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
      name: "balitaT",
      title: "Jumlah Balita Tidak Naik Berat Badan",
      type: "number",
      readOnly: true,
    },
    {
      name: "balitaBBKurang",
      title: "Jumlah Balita Berat Badan Kurang",
      type: "number",
      readOnly: true,
    },
    {
      name: "balitaGiziBuruk",
      title: "Jumlah Balita Gizi Buruk",
      type: "number",
      readOnly: true,
    },
    {
      name: "balitaStunting",
      title: "Jumlah Balita Stunting",
      type: "number",
      readOnly: true,
    },
  ],
});
