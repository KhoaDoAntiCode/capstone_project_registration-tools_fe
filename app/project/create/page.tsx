"use client";

import { useState } from "react";
import UploadWord from "@/components/UploadWord";
import ProjectForm from "@/components/ProjectForm";

export default function CreateProjectPage() {
  const [data, setData] = useState(null);

  return (
    <div>
      <h1>Create Project</h1>

      <UploadWord onParsed={setData} />

      {data && <ProjectForm defaultValues={data} />}
    </div>
  );
}