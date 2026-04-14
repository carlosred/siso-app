"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, Building2, ClipboardCheck, ArrowRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdvisorCompaniesPage() {
  const companies = useQuery(api.companies.list);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies?.filter(c => 
    c.razon_social.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Empresas Asignadas</h1>
          <p className="text-slate-500">Realice las evaluaciones de los estándares mínimos para sus empresas.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies?.map((company) => (
            <div key={company._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{company.razon_social}</h4>
                  <p className="text-sm text-slate-500">NIT: {company.nit}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-500 font-medium">Progreso Evaluación</span>
                  <span className="text-blue-600 font-bold">--%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 rounded-full w-[0%]" />
                </div>
              </div>

              <Link
                href={`/advisor/evaluation/${company._id}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <ClipboardCheck className="w-5 h-5" />
                Realizar Evaluación
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
