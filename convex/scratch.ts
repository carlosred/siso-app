import { action, query } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";

export const getAllUsers = query(async (ctx) => {
  return {
    users: await ctx.db.query("users").collect(),
    companies: await ctx.db.query("companies").collect()
  };
});

export const createMainAdmin = action({
  args: {},
  handler: async (ctx) => {
    try {
      await createAccount(ctx, {
        provider: "password",
        account: {
          id: "proteccionsiso@gmail.com",
          secret: "Proteccion2026*",
        },
        profile: {
          role: "admin",
          name: "SISO Admin",
          email: "proteccionsiso@gmail.com"
        }
      });
      return "Success";
    } catch (err: any) {
      if (err.message.includes("Account already exists")) {
         // Maybe just update it? We can't easily without a mutation
         return "Account already exists";
      }
      throw err;
    }
  }
});
