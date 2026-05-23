import cron from "node-cron";
import { matchQueue } from "../queues/match-queue";
import { db } from "@/db";
import { matches } from "@/db/schema/matchs";
import { eq } from "drizzle-orm";

cron.schedule("*/5 * * * * *", async () => {
  console.log("Verificando partidas agendadas...");

  const matchese = await db.select().from(matches).where(eq(matches.status, "PENDING"));   

  for (const match of matchese) {
    console.log(`Enfileirando partida ${match.id}`);

    await matchQueue.add("simulate-match", {
      matchId: match.id,
    });

    await db.update(matches).set({ status: "IN_PROGRESS" }).where(eq(matches.id, match.id));
  }
});