"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ALL_STANDARDS } from "@/constants/standards";
import { 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ProgressChart } from "@/components/ui/ProgressChart";

export default function CompanyDashboardPage() {
  const companies = useQuery(api.companies.list);
  const company = companies?.[0]; // Company user only sees their own
  const complianceData = useQuery(api.getCompliance, { companyId: company?._id || undefined as any });

  if (!company || !complianceData) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>;
  }

  const score = complianceData.percentage;
  const scoreColor = score < 60 ? "text-red-600" : score < 85 ? "text-orange-500" : "text-green-600";
  const scoreBg = score < 60 ? "bg-red-50" : score < 85 ? "bg-orange-50" : "bg-green-50";

  const standards = ALL_STANDARDS[complianceData.groupId as 7 | 21 | 60] || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Company Header */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 text-blue-600" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                       Mi Empresa
                    </span>
                    <span className="text-slate-400 font-medium">NIT: {company.nit}</span>
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 mb-2">{company.razon_social}</h1>
                 <p className="text-slate-500 max-w-md">
                    Consulte el estado actual de cumplimiento de los estándares mínimos según la Resolución 0312 de 2019.
                 </p>
              </div>

              <div className="flex flex-col items-center z-10 shrink-0">
                 <ProgressChart percentage={score} size={220} strokeWidth={18} />
                 <div className={cn("mt-6 px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase border", scoreBg, scoreColor.replace('text', 'border'), scoreColor)}>
                   {score < 60 ? "Nivel Crítico" : score < 85 ? "Nivel Moderado" : "Nivel Aceptable"}
                 </div>
              </div>
           </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                 <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">Cumple</p>
                 <p className="text-2xl font-black text-slate-900">
                    {complianceData.evaluations.filter(e => e.status === "Cumple").length} / {complianceData.groupId}
                 </p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                 <XCircle className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">No Cumple</p>
                 <p className="text-2xl font-black text-slate-900">
                    {complianceData.evaluations.filter(e => e.status === "No Cumple").length}
                 </p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                 <MinusCircle className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">No Aplica</p>
                 <p className="text-2xl font-black text-slate-900">
                    {complianceData.evaluations.filter(e => e.status === "No Aplica").length}
                 </p>
              </div>
           </div>
        </div>

        {/* Recent Observatons / Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Resumen de Evaluación</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                 <Download className="w-4 h-4" />
                 Descargar Reporte PDF
              </button>
           </div>
           <div className="divide-y divide-slate-50">
              {standards.map((item) => {
                 const evaluation = complianceData.evaluations.find(e => e.standardId === item.id);
                 return (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                             <span className="text-xs font-bold text-slate-400">{item.numeral}</span>
                             <h4 className="text-sm font-bold text-slate-800">{item.descripcion}</h4>
                          </div>
                          {evaluation?.observation && (
                             <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl italic">
                                "{evaluation.observation}"
                             </p>
                          )}
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {evaluation && (
                             <div className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                               evaluation.status === "Cumple" ? "bg-green-50 text-green-600" :
                               evaluation.status === "No Cumple" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                             )}>
                                {evaluation.status}
                             </div>
                          )}
                          {evaluation?.fileUrl && (
                             <a 
                               href={evaluation.fileUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               title="Descargar Evidencia"
                               className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm flex items-center justify-center inline-flex"
                             >
                                <Download className="w-4 h-4" />
                             </a>
                          )}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
