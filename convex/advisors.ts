import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const internalCreateProfile = internalMutation({
  args: {
    userId: v.id("users"),
    nombre: v.string(),
    apellido: v.string(),
    cedula: v.string(),
    licencia: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("advisors", {
      userId: args.userId,
      nombre: args.nombre,
      apellido: args.apellido,
      cedula: args.cedula,
      licencia: args.licencia,
    });
  },
});

export const create = mutation({
  args: {
    nombre: v.string(),
    apellido: v.string(),
    cedula: v.string(),
    licencia: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Only admins can create advisors");

    // 1. Create advisor user
    const advisorUserId = await ctx.db.insert("users", {
      email: args.email,
      role: "advisor",
      name: `${args.nombre} ${args.apellido}`,
    });

    // 2. Create advisor profile
    return await ctx.db.insert("advisors", {
      userId: advisorUserId,
      nombre: args.nombre,
      apellido: args.apellido,
      cedula: args.cedula,
      licencia: args.licencia,
    });
  },
});

export const assignToCompany = mutation({
  args: {
    advisorId: v.id("users"), // advisor's user ID
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Only admins can assign advisors");

    // Check if assignment exists
    const existing = await ctx.db
      .query("assignments")
      .withIndex("by_advisor", (q) => q.eq("advisorId", args.advisorId))
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .unique();
    
    if (existing) return existing._id;

    return await ctx.db.insert("assignments", {
      advisorId: args.advisorId,
      companyId: args.companyId,
    });
  },
});

export const getMyAdvisors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("advisors").collect();
  },
});
