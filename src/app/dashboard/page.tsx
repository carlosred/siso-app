"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

export default function DashboardRedirect() {
  const user = useQuery(api.users.me);
  const router = useRouter();
  const { signOut } = useAuthActions();

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

  // Removed setRole mutation as dev tools are disabled

  if (user && !user.role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4">
        <div className="p-8 bg-white border rounded-xl flex flex-col gap-4 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-slate-800">Cuenta Pendiente</h2>
          <p className="text-sm text-slate-500 mb-4">Su cuenta aún no tiene un rol asignado. Por favor contacte con un Administrador.</p>
          <button
            onClick={async () => {
              await signOut();
              window.location.href = "/auth/login";
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 mt-4 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Cargando dashboard...</p>
      </div>
    </div>
  );
}
