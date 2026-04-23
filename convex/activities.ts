import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to assert admin
async function assertAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  const user = await ctx.db.get(userId);
  if (user?.role !== "admin") throw new Error("Must be an admin");
}

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    
    return await ctx.db.insert("activities", {
      companyId: args.companyId,
      name: args.name,
      description: args.description,
      location: args.location,
      status: "Pendiente"
    });
  }
});

export const getByCompany = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
      
    const advisorNames: string[] = [];
    for (const assignment of assignments) {
      const advisor = await ctx.db
        .query("advisors")
        .withIndex("by_userId", (q) => q.eq("userId", assignment.advisorId))
        .unique();
      if (advisor) {
        advisorNames.push(`${advisor.nombre} ${advisor.apellido}`);
      }
    }
    const advisorText = advisorNames.length > 0 ? advisorNames.join(", ") : "Sin Asignar";

    // Map file storage IDs to actual URLs if they exist
    return await Promise.all(
      activities.map(async (activity) => {
        let fileUrls: string[] = [];
        // Legacy support
        if ((activity as any).fileStorageId) {
          const url = await ctx.storage.getUrl((activity as any).fileStorageId);
          if (url) fileUrls.push(url);
        }
        // New array support
        if (activity.fileStorageIds && activity.fileStorageIds.length > 0) {
          for (const id of activity.fileStorageIds) {
            const url = await ctx.storage.getUrl(id);
            if (url) fileUrls.push(url);
          }
        }
        
        return {
          ...activity,
          fileUrls,
          advisorName: advisorText
        };
      })
    );
  }
});

export const complete = mutation({
  args: {
    activityId: v.id("activities"),
    observations: v.string(),
    fileStorageIds: v.array(v.id("_storage"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    // In strict mode, we'd check if caller is assigned advisor, 
    // but allowing any auth user simplifies MVP.
    const activity = await ctx.db.get(args.activityId);
    if (!activity) throw new Error("Activity not found");

    await ctx.db.patch(args.activityId, {
      status: "Completada",
      observations: args.observations,
      fileStorageIds: args.fileStorageIds,
      completedAt: Date.now()
    });
  }
});

export const getMetrics = query({
  args: {
    companyId: v.optional(v.id("companies"))
  },
  handler: async (ctx, args) => {
    const validCompanyId = args.companyId;
    if (!validCompanyId) return { total: 0, completed: 0, pending: 0, percentage: 0 };
    
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_company", (q) => q.eq("companyId", validCompanyId))
      .collect();
      
    const total = activities.length;
    const completed = activities.filter(a => a.status === "Completada").length;
    
    return {
      total,
      completed,
      pending: total - completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getAdvisorMetrics = query({
  args: {
    advisorUserId: v.id("users")
  },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_advisor", (q) => q.eq("advisorId", args.advisorUserId))
      .collect();
      
    let total = 0;
    let completed = 0;
    
    for (const assignment of assignments) {
      const activities = await ctx.db
        .query("activities")
        .withIndex("by_company", (q) => q.eq("companyId", assignment.companyId))
        .collect();
      
      total += activities.length;
      completed += activities.filter(a => a.status === "Completada").length;
    }
    
    return {
      total,
      completed,
      pending: total - completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
});
