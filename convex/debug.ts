import { query } from "./_generated/server";

export const debugUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const companies = await ctx.db.query("companies").collect();
    return { users, companies };
  },
});
