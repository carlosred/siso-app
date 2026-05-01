import { mutation } from "./_generated/server";

export const fixMissingEmails = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const authAccounts = await ctx.db.query("authAccounts" as any).collect();
    
    let fixedCount = 0;
    for (const user of users) {
      if (!user.email) {
        const account = authAccounts.find(a => a.userId === user._id);
        if (account && account.providerAccountId) {
          await ctx.db.patch(user._id, { email: account.providerAccountId });
          fixedCount++;
        }
      }
    }
    return fixedCount;
  }
});
