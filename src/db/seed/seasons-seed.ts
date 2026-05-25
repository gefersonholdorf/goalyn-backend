import { db } from "@/db";
import {
  seasons,
} from "@/db/schema/seasons";

import {
  competitions,
  competitionStages,
  competitionTeams,
  competitionRules,
  groups,
  groupTeams,
} from "@/db/schema/competitions";

import { teams } from "@/db/schema/teams";

import { eq, inArray } from "drizzle-orm";

export async function seedCompetition() {
  console.log("🌱 Starting season seed...");

  /*
   |--------------------------------------------------------------------------
   | Buscar 4 times existentes
   |--------------------------------------------------------------------------
   */

  const existingTeams = await db
    .select({
      id: teams.id,
      name: teams.name,
    })
    .from(teams)
    .limit(4);

  if (existingTeams.length < 4) {
    throw new Error(
      "Você precisa ter pelo menos 4 times cadastrados."
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Criar temporada
   |--------------------------------------------------------------------------
   */

  const [season] = await db
    .insert(seasons)
    .values({
      name: "Temporada 2026",
      year: "2026",
      status: "ACTIVE",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    })
    .returning();

  console.log("✅ Season created:", season.name);

  /*
   |--------------------------------------------------------------------------
   | Criar competição
   |--------------------------------------------------------------------------
   */

  const [competition] = await db
    .insert(competitions)
    .values({
      seasonId: season.id,
      name: "Goalyn Premier League",
      slug: "goalyn-premier-league-2026",
      type: "LEAGUE",
      status: "ACTIVE",
    })
    .returning();

  console.log("✅ Competition created:", competition.name);

  /*
   |--------------------------------------------------------------------------
   | Criar regras
   |--------------------------------------------------------------------------
   */

  await db.insert(competitionRules).values({
    competitionId: competition.id,

    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,

    homeAway: true,

    awayGoal: false,

    extraTime: false,

    penalties: false,
  });

  console.log("✅ Competition rules created");

  /*
   |--------------------------------------------------------------------------
   | Criar stage
   |--------------------------------------------------------------------------
   */

  const [stage] = await db
    .insert(competitionStages)
    .values({
      competitionId: competition.id,

      name: "Liga",

      type: "LEAGUE",

      order: 1,
    })
    .returning();

  console.log("✅ Stage created");

  /*
   |--------------------------------------------------------------------------
   | Vincular times
   |--------------------------------------------------------------------------
   */

  await db.insert(competitionTeams).values(
    existingTeams.map((team) => ({
      competitionId: competition.id,
      teamId: team.id,
    }))
  );

  console.log("✅ Teams linked to competition");

  /*
   |--------------------------------------------------------------------------
   | Exibir times
   |--------------------------------------------------------------------------
   */

  console.log("🏆 Teams:");

  existingTeams.forEach((team) => {
    console.log(`- ${team.name}`);
  });

  console.log("🎉 Seed completed");
}