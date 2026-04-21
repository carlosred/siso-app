"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  Building2, 
  MapPin, 
  Users,
  ShieldCheck,
  CheckCircle,
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  LogOut
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";
import { ProgressChart } from "@/components/ui/ProgressChart";

export default function CompanyDashboardPage() {
  const companies = useQuery(api.companies.list);
  const company = companies?.[0]; // Company user only sees their own
  const { signOut } = useAuthActions();
  
  const metrics = useQuery(api.activities.getMetrics, company ? { companyId: company._id } : "skip");
  const activities = useQuery(api.activities.getByCompany, company ? { companyId: company._id } : "skip");

  if (!company || !metrics || !activities) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Buscando perfil de empresa...</p>
        <button 
          onClick={async () => {
            await signOut();
            window.location.href = "/auth/login";
          }}
          className="mt-8 flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-xl shadow-sm text-sm font-bold hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  const score = metrics.percentage;
  const scoreColor = score < 60 ? "text-red-600" : score < 85 ? "text-orange-500" : "text-green-600";
  const scoreBg = score < 60 ? "bg-red-50" : score < 85 ? "bg-orange-50" : "bg-green-50";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 md:p-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{company?.razon_social || "Cargando..."}</h1>
            <p className="text-slate-500 text-sm">Panel de Control SG-SST</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
               await signOut();
               window.location.href = "/auth/login";
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Gráfico y Resumen */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Avance de Actividades</h2>
            
            <div className="w-48 h-48 mb-6">
               <ProgressChart percentage={score} />
            </div>

            <div className={cn("px-6 py-3 rounded-2xl w-full", scoreBg)}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className={cn("w-6 h-6", scoreColor)} />
                <span className={cn("text-2xl font-black", scoreColor)}>{score}%</span>
              </div>
              <p className={cn("text-sm font-bold opacity-80", scoreColor)}>Cumplimiento General</p>
            </div>
            
            <div className="w-full mt-6 grid grid-cols-2 gap-4">
               <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Completadas</p>
                 <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
               </div>
               <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Pendientes</p>
                 <p className="text-2xl font-bold text-orange-500">{metrics.pending}</p>
               </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
             <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-emerald-900 font-bold mb-1">Gestión Segura</h4>
                  <p className="text-sm text-emerald-700">Todas las evidencias están protegidas y encriptadas en la nube bajo los estándares de confidencialidad.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Columna Derecha: Lista de Actividades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
             <div className="flex justify-between items-end mb-6">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Actividades Registradas</h2>
                 <p className="text-slate-500">Historial y evidencias provistas por su asesor</p>
               </div>
               <div className="text-right">
                 <p className="text-sm font-bold text-slate-400">Total</p>
                 <p className="text-xl font-black text-slate-800">{metrics.total}</p>
               </div>
             </div>

             <div className="space-y-4">
               {activities.length === 0 ? (
                 <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-slate-500 font-medium">Aún no hay actividades asignadas para su empresa.</p>
                 </div>
               ) : (
                 activities.map(activity => (
                   <div key={activity._id} className={cn(
                     "p-5 rounded-2xl border transition-all",
                     activity.status === "Completada" ? "bg-white border-green-200 shadow-sm" : "bg-slate-50 border-slate-200"
                   )}>
                     <div className="flex flex-col md:flex-row justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           {activity.status === "Completada" ? (
                             <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                           ) : (
                             <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                           )}
                           <h3 className="text-lg font-bold text-slate-800">{activity.name}</h3>
                         </div>
                         
                         <div className="ml-8 mb-3 flex flex-wrap gap-2">
                           {(activity as any).advisorName && (
                             <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md flex items-center gap-1">
                               👤 {(activity as any).advisorName}
                             </span>
                           )}
                           {activity.location && (
                             <span className="text-xs font-bold text-slate-600 bg-slate-200/50 px-2 py-1 rounded-md flex items-center gap-1">
                               📍 {activity.location}
                             </span>
                           )}
                           {activity.completedAt && (
                             <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                               <Clock className="w-3 h-3" /> {new Date(activity.completedAt).toLocaleString("es-CO")}
                             </span>
                           )}
                         </div>

                         {activity.description && (
                           <div className="text-sm text-slate-600 ml-8 mb-2 whitespace-pre-wrap">{activity.description}</div>
                         )}
                         
                         {activity.observations && (
                           <div className="ml-8 mt-3 bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notas del Asesor</p>
                             <p className="text-sm text-slate-700">{activity.observations}</p>
                           </div>
                         )}
                       </div>
                       
                       <div className="flex items-center md:items-start justify-end shrink-0 md:w-48 ml-8 md:ml-0 mt-2 md:mt-0">
                         {activity.status === "Completada" && activity.fileUrl ? (
                           <a 
                             href={activity.fileUrl}
                             target="_blank"
                             rel="noreferrer" 
                             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                           >
                             <FileText className="w-5 h-5" />
                             Descargar
                           </a>
                         ) : (
                           <div className="w-full text-center px-4 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl border border-slate-200">
                             En Proceso
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
