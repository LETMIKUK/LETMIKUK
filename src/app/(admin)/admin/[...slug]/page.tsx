"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { slug } = params;
  return <div>{slug}</div>;
}
