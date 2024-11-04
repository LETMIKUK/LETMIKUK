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
      name: "sasaranBalita",
      title: "Sasaran Balita (Data BPS)",
      type: "number",
      readOnly: true,
    },
    {
      name: "balitaDitemukan",
      title: "Jumlah Balita Ditemukan (EPPGBM)",
      type: "number",
      readOnly: true,
    },
    {
      name: "balitaDiukur",
      title: "Jumlah Balita diukur (EPPGBM)",
      type: "number",
      readOnly: true,
    },
    {
      name: "persentaseDiukur",
      title: "Persentase Balita diukur (Data BPS)",
      type: "number",
      readOnly: true,
    },
  ],
});
