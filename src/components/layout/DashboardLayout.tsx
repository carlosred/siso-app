"use client";

import { ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { 
  LayoutDashboard, 
  Building2, 
  UserRound, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // I'll create this helper

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.me);
  const setRole = useMutation(api.users.setRole);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const roleMap: Record<string, string> = {
    admin: "Administrador",
    advisor: "Asesor",
    company: "Empresa",
  };

  if (user === undefined) return <div className="min-h-screen bg-slate-50 animate-pulse" />;
  if (user === null) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(user.role === "admin" ? [
      { label: "Empresas", href: "/admin/companies", icon: Building2 },
      { label: "Asesores", href: "/admin/advisors", icon: UserRound },
    ] : []),
    ...(user.role === "advisor" ? [
      { label: "Mis Empresas", href: "/advisor/companies", icon: Building2 },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">PROTECCION SISO</span>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm",
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase overflow-hidden">
                {user.name?.[0] || user.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user.name || user.email?.split("@")[0] || "Usuario"}
                </p>
                <p className="text-xs text-slate-500 truncate font-medium">
                  {user.role ? roleMap[user.role] || user.role : "Pendiente"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
           >
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
           <h2 className="font-bold text-slate-800">
             {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
           </h2>
           <div className="flex items-center gap-4">
              {/* Optional header actions */}
           </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
