import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

export const createInitialAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if any admin exists
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    
    if (existingAdmin) return existingAdmin._id;

    return await ctx.db.insert("users", {
      email: args.email,
      role: "admin",
    });
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const listAdvisors = query({
  args: {},
  handler: async (ctx) => {
    const advisorUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "advisor"))
      .collect();
    
    const advisors = await ctx.db.query("advisors").collect();
    
    return advisors.map(advisor => {
      const user = advisorUsers.find(u => u._id === advisor.userId);
      return { ...advisor, email: user?.email };
    });
  },
});
export const setRole = mutation({
  args: {
    role: v.union(v.literal("admin"), v.literal("advisor"), v.literal("company"), v.literal("reset")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    
    const newRole = args.role === "reset" ? undefined : args.role;
    await ctx.db.patch(userId, { role: newRole as any });
    const user = await ctx.db.get(userId);

    if (args.role === "company" && user?.email) {
      // Find company with this email and link it to this user ID
      const company = await ctx.db.query("companies").filter(q => q.eq(q.field("correo"), user.email)).unique();
      if (company) await ctx.db.patch(company._id, { userId: userId });
    } else if (args.role === "advisor" && user?.email) {
      // Logic for advisors if needed later
    }

    return { success: true };
  },
});
