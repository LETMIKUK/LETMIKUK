import { defineField, defineType } from "sanity";

export default defineType({
  name: "demografiBalitaProvinsi",
  title: "Demografi Balita per Provinsi per Bulan",
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
      name: "sasaranBalita",
      title: "Sasaran Balita (Data BPS)",
      type: "number",
    },
    {
      name: "balitaDitemukan",
      title: "Jumlah Balita Ditemukan (EPPGBM)",
      type: "number",
    },
    {
      name: "balitaDiukur",
      title: "Jumlah Balita diukur (EPPGBM)",
      type: "number",
    },
    {
      name: "persentaseDiukur",
      title: "Persentase Balita diukur (Data BPS)",
      type: "number",
    },
  ],
});
