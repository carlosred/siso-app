import { action } from "./_generated/server";
import { v } from "convex/values";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

async function assertAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  const user = await ctx.runQuery(api.users.me);
  if (user?.role !== "admin") throw new Error("Must be an admin");
}

export const createCompanyAccount = action({
  args: {
    razon_social: v.string(),
    nit: v.string(),
    numero_trabajadores: v.number(),
    riesgo: v.number(),
    correo: v.string(),
    direccion: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.correo,
        secret: args.password,
      },
      profile: {
        role: "company",
        name: args.razon_social,
      },
    });

    await ctx.runMutation(internal.companies.internalCreateProfile, {
      userId: user._id,
      razon_social: args.razon_social,
      nit: args.nit,
      numero_trabajadores: args.numero_trabajadores,
      riesgo: args.riesgo,
      correo: args.correo,
      direccion: args.direccion,
    });
  },
});

export const createAdvisorAccount = action({
  args: {
    nombre: v.string(),
    apellido: v.string(),
    cedula: v.string(),
    licencia: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: args.password,
      },
      profile: {
        role: "advisor",
        name: `${args.nombre} ${args.apellido}`,
      },
    });

    await ctx.runMutation(internal.advisors.internalCreateProfile, {
      userId: user._id,
      nombre: args.nombre,
      apellido: args.apellido,
      cedula: args.cedula,
      licencia: args.licencia,
    });
  },
});
