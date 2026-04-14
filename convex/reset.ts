import { mutation } from "./_generated/server";

export const resetData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["users", "companies", "advisors", "assignments", "evaluations", "authAccounts", "authVerifiers", "authSessions", "other_activities"];
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }
    return "Database cleared!";
  },
});
