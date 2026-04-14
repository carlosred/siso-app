"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { ALL_STANDARDS } from "@/constants/standards";
import { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Info, 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Save,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/ui/FileUploader";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function AdvisorEvaluationPage() {
  const { companyId } = useParams();
  const company = useQuery(api.companies.getById, { id: companyId as Id<"companies"> });
  const complianceData = useQuery(api.getCompliance, { companyId: companyId as Id<"companies"> });
  const updateItem = useMutation(api.evaluations.updateItem);
  
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const standards = useMemo(() => {
    if (!complianceData) return [];
    return ALL_STANDARDS[complianceData.groupId as 7 | 21 | 60] || [];
  }, [complianceData]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleStatusUpdate = async (standardId: string, status: "Cumple" | "No Cumple" | "No Aplica") => {
    setSavingId(standardId);
    try {
      await updateItem({
        companyId: companyId as Id<"companies">,
        standardId,
        status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  if (!company || !complianceData) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>;
  }

  const score = complianceData.percentage;
  const scoreColor = score < 60 ? "text-red-600" : score < 85 ? "text-orange-500" : "text-green-600";
  const scoreBg = score < 60 ? "bg-red-50" : score < 85 ? "bg-orange-50" : "bg-green-50";

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header Summary */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                <ShieldCheck className="w-10 h-10" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-900">{company.razon_social}</h1>
                <p className="text-slate-500">Evaluación de Estándares Mínimos (Grupo: {complianceData.groupId})</p>
             </div>
          </div>
          
          <div className={cn("px-8 py-4 rounded-3xl text-center border", scoreBg, scoreColor.replace('text', 'border'))}>
             <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Puntaje Actual</p>
             <h2 className={cn("text-4xl font-black", scoreColor)}>{score.toFixed(1)}%</h2>
             <p className="text-xs font-semibold mt-1">
               {score < 60 ? "Crítico" : score < 85 ? "Moderadamente Aceptable" : "Aceptable"}
             </p>
          </div>
        </div>

        {/* Standards List */}
        <div className="space-y-4">
          {standards.map((item) => {
            const evaluation = complianceData.evaluations.find(e => e.standardId === item.id);
            const isExpanded = expandedItems.includes(item.id);
            const isSaving = savingId === item.id;

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 flex gap-4">
                     <span className="text-slate-400 font-bold text-sm bg-slate-50 px-2 py-1 rounded h-fit">{item.numeral}</span>
                     <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{item.descripcion}</h4>
                        {evaluation && (
                           <div className="flex items-center gap-2 mt-2">
                             {evaluation.status === "Cumple" && <CheckCircle className="w-4 h-4 text-green-500" />}
                             {evaluation.status === "No Cumple" && <XCircle className="w-4 h-4 text-red-500" />}
                             {evaluation.status === "No Aplica" && <MinusCircle className="w-4 h-4 text-slate-400" />}
                             <span className={cn(
                               "text-xs font-bold",
                               evaluation.status === "Cumple" ? "text-green-600" : 
                               evaluation.status === "No Cumple" ? "text-red-600" : "text-slate-500"
                             )}>{evaluation.status}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(item.id, "Cumple")}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                        evaluation?.status === "Cumple" 
                          ? "bg-green-600 border-green-600 text-white" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-green-300 hover:bg-green-50"
                      )}
                    >
                      Cumple
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, "No Cumple")}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                        evaluation?.status === "No Cumple" 
                          ? "bg-red-600 border-red-600 text-white" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:bg-red-50"
                      )}
                    >
                      No Cumple
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, "No Aplica")}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                        evaluation?.status === "No Aplica" 
                          ? "bg-slate-700 border-slate-700 text-white" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      N/A
                    </button>
                    
                    <button 
                      onClick={() => toggleExpand(item.id)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all font-bold"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          {evaluation && 'fileUrl' in evaluation && evaluation.fileUrl && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                               <div className="flex items-center gap-2 text-green-700">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="text-sm font-bold">Evidencia Cargada</span>
                               </div>
                               <a 
                                 href={evaluation.fileUrl as string} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm text-blue-600 hover:text-blue-700"
                               >
                                 Ver Archivo
                               </a>
                            </div>
                          )}
                          <FileUploader 
                            label={evaluation && 'fileUrl' in evaluation && evaluation.fileUrl ? "Reemplazar Evidencia (PDF/Imagen)" : "Cargar Evidencia (PDF/Imagen)"}
                            onUploadComplete={(storageId) => {
                              updateItem({
                                companyId: companyId as Id<"companies">,
                                standardId: item.id,
                                status: evaluation?.status || "No Cumple",
                                fileStorageId: storageId
                              });
                            }}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Observaciones</label>
                          <textarea 
                            defaultValue={evaluation?.observation || ""}
                            onBlur={async (e) => {
                               await updateItem({
                                 companyId: companyId as Id<"companies">,
                                 standardId: item.id,
                                 status: evaluation?.status || "No Cumple",
                                 observation: e.target.value
                               });
                            }}
                            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                            placeholder="Ingrese detalles u observaciones..."
                          />
                        </div>
                     </div>
                     
                     {item.requires_sub_items && (
                        <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                           <div className="flex items-center gap-2 mb-4">
                              <Info className="w-5 h-5 text-blue-600" />
                              <h5 className="font-bold text-blue-900">Evidencias requeridas para Capacitación</h5>
                           </div>
                           <div className="grid md:grid-cols-3 gap-4">
                              {[
                                { id: "plan", label: "A. Plan de Capacitación" },
                                { id: "asistencia", label: "B. Asistencia" },
                                { id: "fotos", label: "C. Registro Fotográfico" }
                              ].map((sub) => {
                                 const subItem = evaluation?.subItems?.find(s => s.id === sub.id);
                                 return (
                                    <div key={sub.id} className="p-4 bg-white rounded-xl border border-blue-100">
                                       <p className="text-xs font-bold text-slate-500 mb-2">{sub.label}</p>
                                       {subItem?.fileStorageId ? (
                                          <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                                             <span className="text-[10px] font-bold text-green-700">SUBIDO</span>
                                             <CheckCircle className="w-4 h-4 text-green-500" />
                                          </div>
                                       ) : (
                                          <FileUploader 
                                            onUploadComplete={async (storageId) => {
                                               const currentSubItems = evaluation?.subItems || [];
                                               const newSubItems = [
                                                 ...currentSubItems.filter(s => s.id !== sub.id),
                                                 { id: sub.id, fileStorageId: storageId }
                                               ];
                                               await updateItem({
                                                 companyId: companyId as Id<"companies">,
                                                 standardId: item.id,
                                                 status: evaluation?.status || "No Cumple",
                                                 // @ts-ignore - Need to update schema or handle array correctly
                                                 subItems: newSubItems
                                               });
                                            }}
                                          />
                                       )}
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Otras Actividades Section */}
        <div className="mt-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <FileText className="w-6 h-6 text-blue-600" />
             Otras Actividades (Sin Puntaje)
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {["Actividades ARL", "Actividades MinTrabajo", "Actividades EPS", "Actividades AFP"].map((name) => (
                <div key={name} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-sm font-bold text-slate-700 mb-4">{name}</p>
                   <FileUploader onUploadComplete={() => {}} />
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
