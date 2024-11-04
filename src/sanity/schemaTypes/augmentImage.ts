import { defineField, defineType } from "sanity";

export default defineType({
  name: "augmentImage",
  title: "Augment Image",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Image ID for retrieval",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // Allows you to specify a focus area for images.
      },
    }),

    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Source of the image content (by whom).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Image description.",
    }),
    defineField({
      name: "imageType",
      title: "Tipe gambar",
      type: "string",
      options: {
        list: [
          { title: "Informasi Kesehatan", value: "health_information" },
          { title: "Contoh Resep", value: "recipe_example" },
          { title: "Grafik Statistik atau Chart", value: "statistic" },
        ],
      },
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "md_1", title: "Metadata 1", type: "string" }),
            defineField({ name: "md_2", title: "Metadata 2", type: "string" }),
            defineField({ name: "md_3", title: "Metadata 3", type: "string" }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "id",
      media: "image",
    },
  },
});
