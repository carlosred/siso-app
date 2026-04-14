export type StandardItem = {
  id: string;
  numeral: string;
  descripcion: string;
  peso?: number;
  requires_sub_items?: boolean;
};

export const STANDARDS_7: StandardItem[] = [
  { id: "7-1", numeral: "1.1.1", descripcion: "Asignación de persona que diseña el Sistema de Gestión de SST" },
  { id: "7-2", numeral: "1.1.2", descripcion: "Afiliación al Sistema de Seguridad Social Integral" },
  { id: "7-3", numeral: "1.1.3", descripcion: "Capacitación en SST", requires_sub_items: true },
  { id: "7-4", numeral: "1.1.4", descripcion: "Plan Anual de Trabajo" },
  { id: "7-5", numeral: "1.1.5", descripcion: "Evaluaciones médicas ocupacionales" },
  { id: "7-6", numeral: "1.1.6", descripcion: "Identificación de peligros; evaluación y valoración de riesgos" },
  { id: "7-7", numeral: "1.1.7", descripcion: "Medidas de prevención y control frente a peligros/riesgos identificados" },
];

export const STANDARDS_21: StandardItem[] = [
  { id: "21-1", numeral: "1.1.1", descripcion: "Asignación de persona que diseña el Sistema de Gestión de SST" },
  { id: "21-2", numeral: "1.1.2", descripcion: "Asignación de recursos para el Sistema de Gestión de SST" },
  { id: "21-3", numeral: "1.1.3", descripcion: "Afiliación al Sistema de Seguridad Social Integral" },
  { id: "21-4", numeral: "1.1.4", descripcion: "Conformación y funcionamiento del COPASST" },
  { id: "21-5", numeral: "1.1.5", descripcion: "Conformación y funcionamiento del Comité de Convivencia Laboral" },
  { id: "21-6", numeral: "1.1.6", descripcion: "Programa de capacitación", requires_sub_items: true },
  { id: "21-7", numeral: "1.1.7", descripcion: "Política de Seguridad y Salud en el Trabajo" },
  { id: "21-8", numeral: "1.1.8", descripcion: "Plan Anual de Trabajo" },
  { id: "21-9", numeral: "1.1.9", descripcion: "Archivo y retención documental del Sistema de Gestión de SST" },
  { id: "21-10", numeral: "1.1.10", descripcion: "Descripción sociodemográfica y diagnóstico de condiciones de salud" },
  { id: "21-11", numeral: "1.1.11", descripcion: "Actividades de medicina del trabajo y de prevención y promoción de la salud" },
  { id: "21-12", numeral: "1.1.12", descripcion: "Evaluaciones médicas ocupacionales" },
  { id: "21-13", numeral: "1.1.13", descripcion: "Restricciones y recomendaciones médicas laborales" },
  { id: "21-14", numeral: "1.1.14", descripcion: "Reporte de accidentes de trabajo y enfermedades laborales" },
  { id: "21-15", numeral: "1.1.15", descripcion: "Investigación de incidentes, accidentes de trabajo y enfermedades laborales" },
  { id: "21-16", numeral: "1.1.16", descripcion: "Identificación de peligros y evaluación y valoración de riesgos IPEVR" },
  { id: "21-17", numeral: "1.1.17", descripcion: "Mantenimiento periódico de instalaciones, equipos, máquinas y herramientas" },
  { id: "21-18", numeral: "1.1.18", descripcion: "Entrega de EPP y capacitación en uso adecuado" },
  { id: "21-19", numeral: "1.1.19", descripcion: "Plan de prevención, preparación y respuesta ante emergencias" },
  { id: "21-20", numeral: "1.1.20", descripcion: "Brigada de prevención, preparación y respuesta ante emergencias" },
  { id: "21-21", numeral: "1.1.21", descripcion: "Revisión por la alta dirección" },
];

export const STANDARDS_60: StandardItem[] = [
  { id: "60-1", numeral: "1.1.1", descripcion: "Asignación de persona que diseña el Sistema de Gestión de SST" },
  { id: "60-2", numeral: "1.1.2", descripcion: "Asignación de responsabilidades en SST" },
  { id: "60-3", numeral: "1.1.3", descripcion: "Asignación de recursos para el Sistema de Gestión de SST" },
  { id: "60-4", numeral: "1.1.4", descripcion: "Afiliación al Sistema de Seguridad Social Integral" },
  { id: "60-5", numeral: "1.1.5", descripcion: "Identificación de trabajadores en actividades de alto riesgo" },
  { id: "60-6", numeral: "1.2.1", descripcion: "Conformación y funcionamiento del COPASST" },
  { id: "60-7", numeral: "1.2.2", descripcion: "Capacitación de los integrantes del COPASST" },
  { id: "60-8", numeral: "1.2.3", descripcion: "Conformación y funcionamiento del Comité de Convivencia Laboral" },
  { id: "60-9", numeral: "2.1.1", descripcion: "Programa de capacitación", requires_sub_items: true },
  { id: "60-10", numeral: "2.2.1", descripcion: "Inducción y reinducción en SST" },
  { id: "60-11", numeral: "2.3.1", descripcion: "Curso Virtual de capacitación de 50 horas en SST" },
  { id: "60-12", numeral: "3.1.1", descripcion: "Política de Seguridad y Salud en el Trabajo" },
  { id: "60-13", numeral: "3.1.2", descripcion: "Objetivos de SST" },
  { id: "60-14", numeral: "3.1.3", descripcion: "Evaluación Inicial del Sistema de Gestión" },
  { id: "60-15", numeral: "3.1.4", descripcion: "Plan Anual de Trabajo" },
  { id: "60-16", numeral: "3.1.5", descripcion: "Archivo y retención documental" },
  { id: "60-17", numeral: "3.1.6", descripcion: "Rendición de cuentas" },
  { id: "60-18", numeral: "3.1.7", descripcion: "Matriz legal" },
  { id: "60-19", numeral: "3.1.8", descripcion: "Mecanismos de comunicación" },
  { id: "60-20", numeral: "3.1.9", descripcion: "Identificación y evaluación para adquisición de bienes y servicios" },
  { id: "60-21", numeral: "3.2.1", descripcion: "Evaluación y selección de proveedores y contratistas" },
  { id: "60-22", numeral: "3.2.2", descripcion: "Gestión del cambio" },
  { id: "60-23", numeral: "4.1.1", descripcion: "Descripción sociodemográfica y diagnóstico de salud" },
  { id: "60-24", numeral: "4.1.2", descripcion: "Actividades de medicina del trabajo, prevención y promoción" },
  { id: "60-25", numeral: "4.1.3", descripcion: "Perfiles de cargos" },
  { id: "60-26", numeral: "4.1.4", descripcion: "Evaluaciones médicas ocupacionales" },
  { id: "60-27", numeral: "4.1.5", descripcion: "Custodia de las historias clínicas" },
  { id: "60-28", numeral: "4.2.1", descripcion: "Restricciones y recomendaciones médicas laborales" },
  { id: "60-29", numeral: "4.2.2", descripcion: "Estilos de vida y entorno saludable" },
  { id: "60-30", numeral: "5.1.1", descripcion: "Servicios de higiene" },
  { id: "60-31", numeral: "5.1.2", descripcion: "Manejo de Residuos" },
  { id: "60-32", numeral: "6.1.1", descripcion: "Reporte de accidentes de trabajo y enfermedades laborales" },
  { id: "60-33", numeral: "6.1.2", descripcion: "Investigación de incidentes, accidentes y enfermedades" },
  { id: "60-34", numeral: "6.1.3", descripcion: "Registro y análisis estadístico" },
  { id: "60-35", numeral: "6.1.4", descripcion: "Frecuencia de accidentalidad" },
  { id: "60-36", numeral: "6.1.5", descripcion: "Severidad de accidentalidad" },
  { id: "60-37", numeral: "6.1.6", descripcion: "Proporción de accidentes de trabajo mortales" },
  { id: "60-38", numeral: "6.1.7", descripcion: "Prevalencia de la enfermedad laboral" },
  { id: "60-39", numeral: "6.1.8", descripcion: "Incidencia de la enfermedad laboral" },
  { id: "60-40", numeral: "6.1.9", descripcion: "Ausentismo por causa médica" },
  { id: "60-41", numeral: "7.1.1", descripcion: "Metodología para identificación de peligros, evaluación y valoración de riesgos" },
  { id: "60-42", numeral: "7.1.2", descripcion: "Identificación de peligros y evaluación y valoración de riesgos IPEVR" },
  { id: "60-43", numeral: "7.1.3", descripcion: "Identificación de sustancias carcinógenas o con toxicidad aguda" },
  { id: "60-44", numeral: "7.1.4", descripcion: "Mediciones ambientales" },
  { id: "60-45", numeral: "7.1.5", descripcion: "Medidas de prevención y control frente a peligros/riesgos identificados" },
  { id: "60-46", numeral: "7.1.6", descripcion: "Aplicación de medidas de prevención y control por los trabajadores" },
  { id: "60-47", numeral: "7.1.7", descripcion: "Procedimientos e instructivos internos de SST" },
  { id: "60-48", numeral: "7.1.8", descripcion: "Inspecciones a instalaciones, maquinaria o equipos" },
  { id: "60-49", numeral: "7.1.9", descripcion: "Mantenimiento periódico de instalaciones, equipos, máquinas y herramientas" },
  { id: "60-50", numeral: "7.1.10", descripcion: "Entrega de EPP y capacitación en uso adecuado" },
  { id: "60-51", numeral: "7.1.11", descripcion: "Plan de prevención, preparación y respuesta ante emergencias" },
  { id: "60-52", numeral: "7.1.12", descripcion: "Brigada de prevención, preparación y respuesta ante emergencias" },
  { id: "60-53", numeral: "8.1.1", descripcion: "Definición de indicadores del Sistema de Gestión de SST" },
  { id: "60-54", numeral: "8.1.2", descripcion: "Auditoría anual" },
  { id: "60-55", numeral: "8.1.3", descripcion: "Revisión por la alta dirección (Alcance de la auditoría)" },
  { id: "60-56", numeral: "8.1.4", descripcion: "Planificación de la auditoría con el COPASST" },
  { id: "60-57", numeral: "9.1.1", descripcion: "Acciones preventivas y/o correctivas" },
  { id: "60-58", numeral: "9.1.2", descripcion: "Acciones de mejora conforme a revisión de la Alta Dirección" },
  { id: "60-59", numeral: "9.1.3", descripcion: "Acciones de mejora con base en investigaciones de accidentes y enfermedades" },
  { id: "60-60", numeral: "9.1.4", descripcion: "Plan de mejoramiento" },
];

const addDefaultWeights = (items: StandardItem[]): Required<StandardItem>[] => {
  const defaultWeight = 100 / items.length;
  return items.map(item => ({
    ...item,
    peso: item.peso ?? defaultWeight,
    requires_sub_items: item.requires_sub_items ?? false,
  }));
};

export const ALL_STANDARDS = {
  7: addDefaultWeights(STANDARDS_7),
  21: addDefaultWeights(STANDARDS_21),
  60: addDefaultWeights(STANDARDS_60),
};
