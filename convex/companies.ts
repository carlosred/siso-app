import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const internalCreateProfile = internalMutation({
  args: {
    userId: v.id("users"),
    razon_social: v.string(),
    nit: v.string(),
    numero_trabajadores: v.number(),
    riesgo: v.number(),
    correo: v.string(),
    direccion: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("companies", {
      userId: args.userId,
      razon_social: args.razon_social,
      nit: args.nit,
      numero_trabajadores: args.numero_trabajadores,
      riesgo: args.riesgo,
      correo: args.correo,
      direccion: args.direccion,
    });
  },
});

// Old create mutation - left logic intact but mostly unused now
export const create = mutation({
  args: {
    razon_social: v.string(),
    nit: v.string(),
    numero_trabajadores: v.number(),
    riesgo: v.number(),
    correo: v.string(),
    direccion: v.string(),
    password: v.string(), // Initial password for the company
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Only admins can create companies");

    // 1. Create unique user for the company
    const companyUserId = await ctx.db.insert("users", {
      email: args.correo,
      role: "company",
      name: args.razon_social,
    });

    // 2. Create company profile
    return await ctx.db.insert("companies", {
      userId: companyUserId,
      razon_social: args.razon_social,
      nit: args.nit,
      numero_trabajadores: args.numero_trabajadores,
      riesgo: args.riesgo,
      correo: args.correo,
      direccion: args.direccion,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const user = await ctx.db.get(userId);
    
    if (user?.role === "admin") {
      return await ctx.db.query("companies").collect();
    }
    
    if (user?.role === "advisor") {
      // Get companies assigned to this advisor
      const assignments = await ctx.db
        .query("assignments")
        .withIndex("by_advisor", (q) => q.eq("advisorId", userId))
        .collect();
      
      const companyIds = assignments.map((a) => a.companyId);
      const companies = [];
      for (const id of companyIds) {
        const company = await ctx.db.get(id);
        if (company) companies.push(company);
      }
      return companies;
    }
    
    if (user?.role === "company") {
      const company = await ctx.db
        .query("companies")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();
      return company ? [company] : [];
    }

    return [];
  },
});

export const getById = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
