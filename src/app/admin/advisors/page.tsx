"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, UserRound, Mail, BadgeCheck, Phone, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export default function AdminAdvisorsPage() {
  const advisors = useQuery(api.users.listAdvisors);
  const createAdvisor = useMutation(api.advisors.create);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    licencia: "",
    email: "",
    password: "", // Handled by standard registration in final flow
  });

  const filteredAdvisors = advisors?.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Asesores</h1>
            <p className="text-slate-500">Administre el equipo de especialistas SISO.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nuevo Asesor
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar asesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvisors?.map((advisor) => (
            <div key={advisor._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {advisor.nombre[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{advisor.nombre} {advisor.apellido}</h4>
                  <p className="text-sm text-slate-500">Licencia: {advisor.licencia}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{advisor.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <BadgeCheck className="w-4 h-4 text-slate-400" />
                    <span>Especialista SST</span>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex gap-2">
                 <button className="flex-1 py-2 bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                   Editar
                 </button>
                 <button className="flex-1 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors">
                   Ver Desempeño
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nuevo Asesor"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await createAdvisor({
                nombre: formData.nombre,
                apellido: formData.apellido,
                cedula: formData.cedula,
                licencia: formData.licencia,
                email: formData.email,
                password: "Pending123!", // Dummy password for old mutation requirement
              });
              setIsModalOpen(false);
              setFormData({ nombre: "", apellido: "", cedula: "", licencia: "", email: "", password: "" });
            } catch (err) {
              console.error(err);
              alert("Error al crear el asesor.");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre(s)</label>
              <input 
                required type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Apellidos</label>
              <input 
                required type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cédula</label>
              <input 
                required type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Licencia SST</label>
              <input 
                required type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.licencia} onChange={e => setFormData({...formData, licencia: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico (Login)</label>
            <input 
              required type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
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
            El asesor deberá registrarse en el portal con el <b>Correo Electrónico</b> proporcionado.
          </p>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
