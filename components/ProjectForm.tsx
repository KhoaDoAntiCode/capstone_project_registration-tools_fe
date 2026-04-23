"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import api from "@/lib/api";

export default function ProjectForm({ defaultValues }: any) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues]);

  const onSubmit = async (data: any) => {
    await api.post("/projects", data);
    alert("Submit thành công!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register("semesterId")} placeholder="Semester" />
      <input {...register("englishName")} placeholder="English Name" />
      <input {...register("vietnameseName")} placeholder="Vietnamese Name" />
      <textarea {...register("context")} placeholder="Context" />
      <textarea {...register("proposedSolutions")} placeholder="Solutions" />

      <button type="submit" className="bg-blue-500 text-white p-2">
        Submit
      </button>
    </form>
  );
}