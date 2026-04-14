import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ALL_STANDARDS } from "../src/constants/standards";

export const getCompliance = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return null;

    // 1. Determine which group of standards applies
    let groupId: 7 | 21 | 60 = 60;
    if (company.numero_trabajadores <= 10 && company.riesgo <= 3) {
      groupId = 7;
    } else if (company.numero_trabajadores <= 50 && company.riesgo <= 3) {
      groupId = 21;
    }

    // 2. Get all evaluations for this company
    const evaluations = await ctx.db
      .query("evaluations")
      .withIndex("by_company_standard", (q) => q.eq("companyId", args.companyId))
      .collect();

    // 3. Calculation Logic
    // In SG-SST Regulation 0312:
    // "Cumple": 100% of the item value (peso)
    // "No Aplica": 100% of the item value (does not penalize)
    // "No Cumple": 0%

    const standardsGroup = ALL_STANDARDS[groupId];
    let percentage = 0;

    standardsGroup.forEach(item => {
      const evaluation = evaluations.find(e => e.standardId === item.id);
      if (evaluation && (evaluation.status === "Cumple" || evaluation.status === "No Aplica")) {
        percentage += item.peso;
      }
    });
    
    // Ensure math precision clamp (e.g. 99.99999 -> 100)
    percentage = Math.min(Math.round(percentage * 100) / 100, 100);

    const evaluationsWithUrl = await Promise.all(
      evaluations.map(async (e) => ({
        ...e,
        fileUrl: e.fileStorageId ? await ctx.storage.getUrl(e.fileStorageId) : null,
      }))
    );

    return {
      percentage,
      groupId,
      evaluations: evaluationsWithUrl,
    };
  },
});

export const updateItem = mutation({
  args: {
    companyId: v.id("companies"),
    standardId: v.string(),
    status: v.union(v.literal("Cumple"), v.literal("No Cumple"), v.literal("No Aplica")),
    observation: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // Check if user is the advisor assigned or admin
    const user = await ctx.db.get(userId);
    if (user?.role === "company") throw new Error("Companies cannot edit evaluations");

    const existing = await ctx.db
      .query("evaluations")
      .withIndex("by_company_standard", (q) => q.eq("companyId", args.companyId).eq("standardId", args.standardId))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        status: args.status,
        observation: args.observation,
        fileStorageId: args.fileStorageId,
      });
    } else {
      return await ctx.db.insert("evaluations", {
        companyId: args.companyId,
        standardId: args.standardId,
        status: args.status,
        observation: args.observation,
        fileStorageId: args.fileStorageId,
      });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
