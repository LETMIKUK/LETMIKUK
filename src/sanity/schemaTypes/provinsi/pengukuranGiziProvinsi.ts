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
    }),
    {
      name: "tahun",
      title: "Tahun",
      type: "number",
      initialValue: 2024,
    },

    { name: "bulan", title: "Bulan (1-12)", type: "number" },
    {
      name: "balitaT",
      title: "Jumlah Balita Tidak Naik Berat Badan",
      type: "number",
    },
    {
      name: "balitaBBKurang",
      title: "Jumlah Balita Berat Badan Kurang",
      type: "number",
    },
    {
      name: "balitaGiziBuruk",
      title: "Jumlah Balita Gizi Buruk",
      type: "number",
    },
    {
      name: "balitaStunting",
      title: "Jumlah Balita Stunting",
      type: "number",
    },
  ],
});
