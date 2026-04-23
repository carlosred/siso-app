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

  // Assigned Custom Activities
  activities: defineTable({
    companyId: v.id("companies"), // Assigned to this company
    name: v.string(), // e.g. "Capacitar personal"
    description: v.string(), // mandatory description
    location: v.string(), // required location
    status: v.union(v.literal("Pendiente"), v.literal("Completada")),
    observations: v.optional(v.string()), // Advisor's text
    fileStorageId: v.optional(v.id("_storage")), // Legacy single PDF
    fileStorageIds: v.optional(v.array(v.id("_storage"))), // Uploaded PDFs (up to 3)
    completedAt: v.optional(v.number()),
  }).index("by_company", ["companyId"]),
});
