import cron from "node-cron";
import { matchQueue } from "../queues/match-queue";
import { db } from "@/db";
import { matches } from "@/db/schema/matchs";
import { and, eq, lte } from "drizzle-orm";

cron.schedule("*/30 * * * * *", async () => {
  console.log("Verificando partidas agendadas...");

  const date = new Date()
  date.setHours(date.getHours() - 3) 

  const matchese = await db.select().from(matches).where(and(
    eq(matches.status, "SCHEDULED"),
    lte(matches.scheduledAt, date)
  ));  
  
  console.log(`Encontradas ${matchese.length} partidas para iniciar.`);
  console.log(date)

  for (const match of matchese) {
    console.log(`Enfileirando partida ${match.id}`);

    await matchQueue.add("simulate-match", {
      matchId: match.id,
    });

    await db.update(matches).set({ status: "LIVE" }).where(eq(matches.id, match.id));
  }
});