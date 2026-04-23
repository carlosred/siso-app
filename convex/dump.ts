
import { query } from "./_generated/server";
export const dump = query(async (ctx) => {
  return {
    users: await ctx.db.query("users").collect(),
    companies: await ctx.db.query("companies").collect()
  };
});
