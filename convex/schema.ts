import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Override users table to add application-specific fields
  users: defineTable({
    // Fields from @convex-dev/auth authTables:
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Application-specific fields:
    role: v.optional(v.union(v.literal("admin"), v.literal("advisor"), v.literal("company"))),
  }).index("email", ["email"]),

  companies: defineTable({
    userId: v.id("users"), // Account linked to this company
    razon_social: v.string(),
    nit: v.string(),
    numero_trabajadores: v.number(),
    riesgo: v.number(), // 1 to 5
    correo: v.string(),
    direccion: v.string(),
  }).index("by_userId", ["userId"]),

  advisors: defineTable({
    userId: v.id("users"), // Account linked to this advisor
    nombre: v.string(),
    apellido: v.string(),
    cedula: v.string(),
    licencia: v.string(),
  }).index("by_userId", ["userId"]),

  assignments: defineTable({
    advisorId: v.id("users"), // advisor's user ID
    companyId: v.id("companies"),
  })
  .index("by_advisor", ["advisorId"])
  .index("by_company", ["companyId"]),

  // Standards are mostly static but we might store them to link evaluations
  standards: defineTable({
    groupId: v.number(), // 7, 21, 60
    numeral: v.string(),
    descripcion: v.string(),
    requires_sub_items: v.boolean(),
  }).index("by_group", ["groupId"]),

  evaluations: defineTable({
    companyId: v.id("companies"),
    standardId: v.string(), // We'll link via our constant IDs or standardId if stored
    status: v.union(v.literal("Cumple"), v.literal("No Cumple"), v.literal("No Aplica")),
    observation: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    // Sub-items for Capacitaciones
    subItems: v.optional(v.array(v.object({
      id: v.string(), // "plan", "asistencia", "fotos"
      fileStorageId: v.id("_storage"),
    }))),
  }).index("by_company_standard", ["companyId", "standardId"]),

  other_activities: defineTable({
    companyId: v.id("companies"),
    type: v.union(v.literal("ARL"), v.literal("MinTrabajo"), v.literal("EPS"), v.literal("AFP")),
    fileStorageId: v.id("_storage"),
  }).index("by_company", ["companyId"]),
});
