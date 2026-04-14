import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Setup Advisors
    const advisor1 = await ctx.db.query("users").withIndex("email", q => q.eq("email", "asesor1@siso.com")).unique();
    if (!advisor1) throw new Error("User asesor1@siso.com not found. Please sign up first.");
    await ctx.db.patch(advisor1._id, { role: "advisor" });
    const advisor1Id = advisor1._id;

    const advisor2 = await ctx.db.query("users").withIndex("email", q => q.eq("email", "asesor2@siso.com")).unique();
    if (!advisor2) throw new Error("User asesor2@siso.com not found. Please sign up first.");
    await ctx.db.patch(advisor2._id, { role: "advisor" });
    const advisor2Id = advisor2._id;

    // 2. Setup Companies
    const companyAUser = await ctx.db.query("users").withIndex("email", q => q.eq("email", "contacto@cafe-andino.com")).unique();
    if (!companyAUser) throw new Error("User contacto@cafe-andino.com not found. Please sign up first.");
    await ctx.db.patch(companyAUser._id, { role: "company" });
    const companyAUserId = companyAUser._id;

    const companyBUser = await ctx.db.query("users").withIndex("email", q => q.eq("email", "hr@textiles-pacifico.com")).unique();
    if (!companyBUser) throw new Error("User hr@textiles-pacifico.com not found. Please sign up first.");
    await ctx.db.patch(companyBUser._id, { role: "company" });
    const companyBUserId = companyBUser._id;

    const companyCUser = await ctx.db.query("users").withIndex("email", q => q.eq("email", "admin@mineria-norte.com")).unique();
    if (!companyCUser) throw new Error("User admin@mineria-norte.com not found. Please sign up first.");
    await ctx.db.patch(companyCUser._id, { role: "company" });
    const companyCUserId = companyCUser._id;

    // Admin
    const adminUser = await ctx.db.query("users").withIndex("email", q => q.eq("email", "siso@test.com")).unique();
    if (adminUser) await ctx.db.patch(adminUser._id, { role: "admin" });
    const companyAId = await ctx.db.insert("companies", {
      userId: companyAUserId,
      razon_social: "Café Andino SAS",
      nit: "900.123.456",
      numero_trabajadores: 8,
      riesgo: 2,
      correo: "contacto@cafe-andino.com",
      direccion: "Calle 45 # 12-34, Bogotá",
    });

    // Company B: 35 workers, Risk 3 (Group 21)
    const companyBId = await ctx.db.insert("companies", {
      userId: companyBUserId,
      razon_social: "Textiles del Pacífico",
      nit: "860.999.001",
      numero_trabajadores: 35,
      riesgo: 3,
      correo: "hr@textiles-pacifico.com",
      direccion: "Cr 80 # 20-10, Medellín",
    });

    // Company C: 120 workers, Risk 5 (Group 60)
    const companyCId = await ctx.db.insert("companies", {
      userId: companyCUserId,
      razon_social: "Minería del Norte SA",
      nit: "700.555.222",
      numero_trabajadores: 120,
      riesgo: 5,
      correo: "admin@mineria-norte.com",
      direccion: "Km 4 Vía Mina, Bucaramanga",
    });

    // 3. Assignments
    await ctx.db.insert("assignments", {
      advisorId: advisor1Id,
      companyId: companyAId,
    });
    await ctx.db.insert("assignments", {
      advisorId: advisor1Id,
      companyId: companyBId,
    });
    await ctx.db.insert("assignments", {
      advisorId: advisor2Id,
      companyId: companyCId,
    });

    // 4. Initial Evaluations for Company A (Group 7)
    // 7 items: ids 7-1 to 7-7
    const statuses: ("Cumple" | "No Cumple" | "No Aplica")[] = ["Cumple", "Cumple", "No Cumple", "No Aplica", "Cumple"];
    for (let i = 1; i <= 5; i++) {
        await ctx.db.insert("evaluations", {
            companyId: companyAId,
            standardId: `7-${i}`,
            status: statuses[i-1],
            observation: `Evaluación inicial para ítem 7-${i}`,
        });
    }

    return "Seed completed successfully!";
  },
});
