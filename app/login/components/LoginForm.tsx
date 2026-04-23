"use client";

import { useState } from "react"; 
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

import api from "@/lib/api";

import LoginAlert from "./LoginAlert";
// import { decodeJWT, updateCurrentUser } from "@/lib/utils/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RES:", res.data);

    const token =
      res.data?.accessToken ||
      res.data?.token ||
      res.data?.data?.accessToken;

    if (!token) {
      alert("Không có token từ API");
      return;
    }

    localStorage.setItem("accessToken", token);
    router.push("/dashboard");
  };

  return (
    <>
      <CardContent className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          <LoginAlert error={error} />

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
