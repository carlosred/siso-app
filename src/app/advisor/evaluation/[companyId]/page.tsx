"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  Save,
  FileText
} from "lucide-react";
import { FileUploader } from "@/components/ui/FileUploader";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function CompanyActivitiesPage() {
  const params = useParams();
  const companyId = params.companyId as Id<"companies">;
  
  const assignments = useQuery(api.companies.list);
  const company = assignments?.find(c => c._id === companyId);
  const activities = useQuery(api.activities.getByCompany, { companyId });
  const completeActivity = useMutation(api.activities.complete);

  // States per activity row
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [fileIds, setFileIds] = useState<Record<string, Id<"_storage">[]>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  if (!assignments || !activities) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
         <div className="py-20 text-center text-slate-500">
           No tiene acceso a esta empresa.
         </div>
      </DashboardLayout>
    );
  }

  const handleComplete = async (activityId: string) => {
    const obs = observations[activityId] || "";
    const ids = fileIds[activityId] || [];
    
    if (ids.length === 0) {
      alert("Para completar la actividad debe adjuntar al menos 1 Evidencia (Subir Archivo).");
      return;
    }

    setSubmitting(prev => ({ ...prev, [activityId]: true }));
    try {
      await completeActivity({
        activityId: activityId as Id<"activities">,
        observations: obs,
        fileStorageIds: ids
      });
      alert("¡Actividad completada y enviada a la Empresa exitosamente!");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al intentar completar la actividad.");
    } finally {
      setSubmitting(prev => ({ ...prev, [activityId]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Actividades Asignadas</h1>
          <p className="text-slate-500">
             Gestione las actividades y capacitaciones de <b>{company.razon_social}</b>
          </p>
        </div>

        {activities.length === 0 && (
          <div className="bg-slate-50 p-12 rounded-3xl text-center border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No hay actividades</h3>
            <p className="text-slate-500">El Administrador aún no ha asignado ninguna actividad a esta empresa.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {activities.map(activity => (
            <div key={activity._id} className={cn(
              "p-6 rounded-3xl border shadow-sm transition-all",
              activity.status === "Completada" ? "bg-green-50/30 border-green-200" : "bg-white border-slate-200"
            )}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activity.name}</h3>
                  {activity.description && (
                    <div className="text-sm text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg whitespace-pre-wrap leading-relaxed">{activity.description}</div>
                  )}
                  {activity.location && (
                    <p className="text-sm font-semibold text-slate-700 mt-3 flex items-center gap-1">📍 {activity.location}</p>
                  )}
                </div>
                <div>
                  {activity.status === "Completada" ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-bold text-sm rounded-full">
                      <CheckCircle className="w-4 h-4" /> Actividad Completada
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 font-bold text-sm rounded-full">
                      <Clock className="w-4 h-4" /> Pendiente
                    </span>
                  )}
                </div>
              </div>

              {activity.status === "Pendiente" ? (
                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Observaciones</label>
                    <textarea 
                      rows={3}
                      placeholder="Indique los detalles de ejecución de esta actividad..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900"
                      value={observations[activity._id] || ""}
                      onChange={e => setObservations({ ...observations, [activity._id]: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Evidencias Requeridas (PDF/IMG - Máx 3)</label>
                    <div className="grid gap-3">
                      {(fileIds[activity._id] || []).map((id, index) => (
                        <div key={id} className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 shadow-sm">
                          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                          <span>Evidencia {index + 1} adjunta correctamente</span>
                        </div>
                      ))}
                      {(!fileIds[activity._id] || fileIds[activity._id].length < 3) && (
                        <FileUploader 
                          key={`uploader-${activity._id}-${fileIds[activity._id]?.length || 0}`}
                          label={`Subir Evidencia ${(!fileIds[activity._id] ? 0 : fileIds[activity._id].length) + 1}`} 
                          onUploadComplete={(id) => setFileIds({ 
                            ...fileIds, 
                            [activity._id]: [...(fileIds[activity._id] || []), id] 
                          })} 
                        />
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => handleComplete(activity._id)}
                      disabled={submitting[activity._id]}
                      className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {submitting[activity._id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Completar y Subir Evidencia
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-green-100">
                  {activity.completedAt && (
                    <div className="mb-2">
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 
                        Completada el: {new Date(activity.completedAt).toLocaleString("es-CO")}
                      </span>
                    </div>
                  )}
                  {activity.observations && (
                    <div className="bg-white p-4 rounded-xl border border-green-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Observaciones Iniciales</p>
                      <p className="text-sm text-slate-700">{activity.observations}</p>
                    </div>
                  )}
                  {activity.fileUrls && activity.fileUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {activity.fileUrls.map((url: string, i: number) => (
                        <a 
                          key={i}
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-200 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-sm"
                        >
                          <FileText className="w-5 h-5" />
                          Ver Evidencia {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  {/* Legacy support */}
                  {(activity as any).fileUrl && (!activity.fileUrls || activity.fileUrls.length === 0) && (
                    <div>
                      <a 
                        href={(activity as any).fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-200 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-sm"
                      >
                        <FileText className="w-5 h-5" />
                        Ver Evidencia Adjunta
                      </a>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
