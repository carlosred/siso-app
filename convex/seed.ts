import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const getOrCreateUser = async (email: string, role: string, name?: string) => {
      let user = await ctx.db.query("users").withIndex("email", q => q.eq("email", email)).first();
      if (!user) {
        const id = await ctx.db.insert("users", { email, role: role as any, name });
        return { _id: id, role };
      }
      await ctx.db.patch(user._id, { role: role as any });
      return user;
    };

    // 0. Clean up everything first to guarantee idempotency!
    for (const table of ["companies", "assignments", "advisors", "activities"] as const) {
      const items = await ctx.db.query(table).collect();
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
    }

    // 1. Setup Advisors
    const advisor1UserId = (await getOrCreateUser("asesor1@siso.com", "advisor", "Asesor 1"))._id;
    const advisor2UserId = (await getOrCreateUser("asesor2@siso.com", "advisor", "Asesor 2"))._id;

    await ctx.db.insert("advisors", {
      userId: advisor1UserId,
      nombre: "Asesor",
      apellido: "Uno",
      cedula: "1111",
      licencia: "L-1"
    });
    
    await ctx.db.insert("advisors", {
      userId: advisor2UserId,
      nombre: "Asesor",
      apellido: "Dos",
      cedula: "2222",
      licencia: "L-2"
    });

    // 2. Setup Companies
    const companyAUserId = (await getOrCreateUser("contacto@cafe-andino.com", "company", "Café Andino SAS"))._id;
    const companyBUserId = (await getOrCreateUser("hr@textiles-pacifico.com", "company", "Textiles del Pacífico"))._id;
    const companyCUserId = (await getOrCreateUser("admin@mineria-norte.com", "company", "Minería del Norte SA"))._id;

    // Admin
    await getOrCreateUser("siso@test.com", "admin", "Admin SISO");
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
      advisorId: advisor1UserId,
      companyId: companyAId,
    });
    await ctx.db.insert("assignments", {
      advisorId: advisor1UserId,
      companyId: companyBId,
    });
    await ctx.db.insert("assignments", {
      advisorId: advisor2UserId,
      companyId: companyCId,
    });

    // 4. Initial Activities for Company A
    const statuses: ("Pendiente" | "Completada")[] = ["Pendiente", "Completada", "Pendiente"];
    const activityNames = ["Capacitacion brigada", "Inspección extintores", "Revisión matriz legal"];
    const locations = ["Planta Principal", "Oficinas Centrales", "Virtual"];
    for (let i = 0; i < 3; i++) {
        await ctx.db.insert("activities", {
            companyId: companyAId,
            name: activityNames[i],
            status: statuses[i],
            description: "Actividad generada de prueba obligatoria",
            location: locations[i],
            completedAt: statuses[i] === "Completada" ? Date.now() : undefined,
        });
    }

    return "Seed completed successfully!";
  },
});
