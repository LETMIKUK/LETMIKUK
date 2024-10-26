import { defineField, defineType } from "sanity";

export default defineType({
  name: "appAccount",
  title: "App Account",
  type: "document",
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      readOnly: true,
    }),
    { name: "email", title: "Email", type: "string" },
    { name: "hashedPassword", title: "Hashed Password", type: "string" },
    { name: "role", title: "Role", type: "string" },
    { name: "createdAt", title: "Created At", type: "datetime" },
  ],
});
