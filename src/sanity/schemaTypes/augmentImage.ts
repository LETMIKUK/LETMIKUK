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
  ],

  preview: {
    select: {
      title: "id",
      media: "image",
    },
  },
});
