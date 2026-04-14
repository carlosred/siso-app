"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardRedirect() {
  const user = useQuery(api.users.me);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/auth/login");
    } else if (user) {
      if (user.role === "admin") {
        router.push("/admin/companies");
      } else if (user.role === "advisor") {
        router.push("/advisor/companies");
      } else if (user.role === "company") {
        router.push("/company");
      }
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Cargando dashboard...</p>
      </div>
    </div>
  );
}
