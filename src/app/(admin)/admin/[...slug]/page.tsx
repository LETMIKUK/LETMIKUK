// app/admin/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { categories } from "@/app/json/adminSidebarLinks";

// Helper function to check if the slug is valid
const isValidSlug = (slugArray: string[]) => {
  const validSlugs = categories.flatMap((category) =>
    category.links.map((link) => link.url.split("/").filter(Boolean))
  );

  return validSlugs.some(
    (validSlug) => JSON.stringify(validSlug) === JSON.stringify(slugArray)
  );
};

// Function to generate static params
export async function generateStaticParams() {
  const validSlugs = categories.flatMap((category) =>
    category.links.map((link) => {
      return { slug: link.url.split("/").filter(Boolean) };
    })
  );
  return validSlugs;
}

// Page component for the dynamic route
export default function AdminDynamicPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug } = params;

  // If the slug is invalid, show a 404 page
  if (!isValidSlug(slug)) {
    notFound();
  }

  // Find the matching category and link
  const matchingCategory = categories.find((category) =>
    slug.includes(category.id)
  );
  const matchingLink = matchingCategory?.links.find((link) =>
    link.url.split("/").every((part, index) => part === slug[index])
  );

  if (!matchingLink) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{matchingCategory?.title}</h1>
      <h2>{matchingLink?.title}</h2>
      {/* Render actual content for the matched route */}
      <p>Content for {matchingLink?.title} goes here.</p>
    </div>
  );
}
