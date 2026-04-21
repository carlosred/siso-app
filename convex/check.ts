import { query } from "./_generated/server";

export const checkUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").withIndex("email", q => q.eq("email", "hr@textiles-pacifico.com")).collect();
  }
});
