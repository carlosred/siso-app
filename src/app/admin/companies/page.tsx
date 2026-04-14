"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, Search, Building2, MapPin, Users as UsersIcon, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

export default function AdminCompaniesPage() {
  const companies = useQuery(api.companies.list);
  const advisors = useQuery(api.users.listAdvisors);
  const createCompany = useMutation(api.companies.create);
  const assignAdvisor = useMutation(api.advisors.assignToCompany);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<any>(null);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    razon_social: "",
    nit: "",
    numero_trabajadores: "",
    riesgo: "1",
    correo: "",
    direccion: "",
    password: "", // Handled by standard registration but required in the old mutation signature
  });

  const filteredCompanies = companies?.filter(c => 
    c.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nit.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Empresas</h1>
            <p className="text-slate-500">Administre las empresas registradas en el sistema.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nueva Empresa
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-sm text-slate-500 font-medium mb-1">Total Empresas</p>
             <h3 className="text-3xl font-bold text-slate-900">{companies?.length || 0}</h3>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-sm text-slate-500 font-medium mb-1">Riesgo IV - V</p>
             <h3 className="text-3xl font-bold text-orange-600">{companies?.filter(c => c.riesgo >= 4).length || 0}</h3>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-sm text-slate-500 font-medium mb-1">Promedio Avance</p>
             <h3 className="text-3xl font-bold text-blue-600">--%</h3>
           </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por razón social o NIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies?.map((company) => (
            <div key={company._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  company.riesgo >= 4 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                )}>
                  Riesgo {company.riesgo}
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-1">{company.razon_social}</h4>
              <p className="text-sm text-slate-500 mb-4">NIT: {company.nit}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <UsersIcon className="w-4 h-4" />
                  <span>{company.numero_trabajadores} trabajadores</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{company.direccion}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                 <button 
                   onClick={() => {
                     setSelectedCompanyId(company._id);
                     setSelectedAdvisorId(null);
                     setIsAssignModalOpen(true);
                   }}
                   className="flex-1 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                 >
                   Asignar Asesor
                 </button>
              </div>
            </div>
          ))}

          {filteredCompanies?.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No se encontraron empresas</h3>
              <p className="text-slate-500">Intente con otro término de búsqueda o cree una nueva empresa.</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nueva Empresa"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await createCompany({
                razon_social: formData.razon_social,
                nit: formData.nit,
                numero_trabajadores: parseInt(formData.numero_trabajadores, 10),
                riesgo: parseInt(formData.riesgo, 10),
                correo: formData.correo,
                direccion: formData.direccion,
                password: "Pending123!", // Must provide default so mutation logic executes smoothly
              });
              setIsModalOpen(false);
              setFormData({ razon_social: "", nit: "", numero_trabajadores: "", riesgo: "1", correo: "", direccion: "", password: "" });
            } catch (err) {
              console.error(err);
              alert("Error al crear la empresa.");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Razón Social</label>
            <input 
              required type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.razon_social} onChange={e => setFormData({...formData, razon_social: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">NIT</label>
              <input 
                required type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nit} onChange={e => setFormData({...formData, nit: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Trabajadores</label>
              <input 
                required type="number" min="1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.numero_trabajadores} onChange={e => setFormData({...formData, numero_trabajadores: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nivel de Riesgo</label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.riesgo} onChange={e => setFormData({...formData, riesgo: e.target.value})}
              >
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>Riesgo {r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                required type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección</label>
            <input 
              required type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})}
            />
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">
               Cancelar
             </button>
             <button disabled={loading} type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2">
               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
               Guardar y Crear
             </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center text-balance">
            La empresa debe luego registrarse en el sistema con el <b>Correo Electrónico</b> proporcionado para acceder.
          </p>
        </form>
      </Modal>

      <Modal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        title="Asignar Asesor a Empresa"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Seleccione el asesor especialista que se encargará del Sistema de Gestión de esta empresa.
          </p>
          
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {advisors?.map(advisor => (
              <label 
                key={advisor._id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                  selectedAdvisorId === advisor.userId 
                    ? "border-blue-600 bg-blue-50" 
                    : "border-slate-200 hover:border-blue-300 bg-white"
                )}
              >
                <input 
                  type="radio" 
                  name="advisor" 
                  value={advisor.userId}
                  checked={selectedAdvisorId === advisor.userId}
                  onChange={() => setSelectedAdvisorId(advisor.userId)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <p className="font-bold text-slate-900">{advisor.nombre} {advisor.apellido}</p>
                  <p className="text-xs text-slate-500">Licencia: {advisor.licencia}</p>
                </div>
              </label>
            ))}
            
            {advisors?.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl">
                No hay asesores disponibles. Registre uno primero.
              </p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={() => setIsAssignModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">
               Cancelar
             </button>
             <button 
               disabled={loading || !selectedAdvisorId} 
               onClick={async () => {
                 setLoading(true);
                 try {
                   await assignAdvisor({
                     advisorId: selectedAdvisorId,
                     companyId: selectedCompanyId,
                   });
                   setIsAssignModalOpen(false);
                 } catch (err) {
                   console.error(err);
                   alert("Error al asignar el asesor. Verifique que no esté asignado ya.");
                 } finally {
                   setLoading(false);
                 }
               }}
               className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
             >
               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
               Asignar Asesor
             </button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
