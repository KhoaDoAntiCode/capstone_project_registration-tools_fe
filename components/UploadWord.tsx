"use client";

import api from "@/lib/api";

export default function UploadWord({ onParsed }: any) {
  const handleUpload = async (e: any) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/projects/parse", formData);

    console.log("PARSED:", res.data);

    onParsed(res.data);
  };

  return <input type="file" accept=".docx" onChange={handleUpload} />;
}