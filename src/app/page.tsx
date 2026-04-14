"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Target, Eye, Users, FileText, ChevronRight } from "lucide-react";
import { useConvexAuth } from "convex/react";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PROTECCION <span className="text-blue-600">SISO</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                Gestión inteligente de <span className="text-blue-600">Seguridad y Salud</span> en el Trabajo.
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Plataforma integral basada en la Resolución 0312 de 2019. Simplificamos el cumplimiento normativo para empresas y asesores en Colombia.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  Comenzar ahora <ChevronRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                  Ver Soluciones
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-white/50">
                 {/* Placeholder for SG-SST image */}
                 <div className="bg-blue-100 aspect-video flex items-center justify-center">
                    <ShieldCheck className="w-32 h-32 text-blue-400 opacity-50" />
                 </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Misión</h3>
                <p className="text-slate-600 leading-relaxed italic">
                  "Somos una empresa que con sus especialistas, profesionales y técnicos, se encarga de servir de instrumento y apoyo para satisfacer las necesidades en seguridad y salud en el trabajo de cualquier cliente, apoyados en nuestra capacidad ágil y rápida en dar soluciones a sus inquietudes, buscando generar trabajos seguros."
                </p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Visión</h3>
                <p className="text-slate-600 leading-relaxed italic">
                  "Lograr ser una empresa líder en prestar servicios de seguridad y salud en el trabajo, a su vez comercializar elementos de protección personal."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles / Features */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Una solución para cada rol</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada para facilitar la colaboración entre administradores, asesores y empresas.
            </p>
          </div>
          <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: "Administradores",
                desc: "Gestión global de empresas y asesores. Auditoría de evidencias y seguimiento de cumplimiento."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
                title: "Asesores",
                desc: "Evaluación de estándares, carga de evidencias fotográficas y seguimiento dinámico de cada empresa."
              },
              {
                icon: <FileText className="w-6 h-6 text-blue-600" />,
                title: "Empresas",
                desc: "Acceso a reportes, descarga de archivos y visualización del avance del Sistema de Gestión."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-bold">PROTECCION SISO SAS</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2024 PROTECCION SISO SAS. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-slate-400">
             {/* Simple social placeholders */}
             <div className="w-5 h-5 bg-slate-100 rounded" />
             <div className="w-5 h-5 bg-slate-100 rounded" />
             <div className="w-5 h-5 bg-slate-100 rounded" />
          </div>
        </div>
      </footer>
    </div>
  );
}
