"use client";

// import { OpenAPI } from "@/lib/api/generated";
import { useEffect } from "react";

export function ApiProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    // // 👉 gọi thẳng BE luôn (bỏ proxy)
    // OpenAPI.BASE = baseUrl || "https://localhost:7148/api";

    // // ❌ không cần cookie
    // OpenAPI.WITH_CREDENTIALS = false;

    // // ✅ luôn lấy token mới nhất
    // OpenAPI.TOKEN = async () => {
    //   return localStorage.getItem("accessToken") || "";
    // };

  }, []);

  return <>{children}</>;
}