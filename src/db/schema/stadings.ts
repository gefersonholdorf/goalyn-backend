import { pgTable, uuid } from "drizzle-orm/pg-core";
import { seasons } from "./seasons";
import { competitions, competitionStages, groups } from "./competitions";
import { teams } from "./teams";
import { integer } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

export const standings = pgTable("standings", {
  id: uuid("id").defaultRandom().primaryKey(),

  seasonId: uuid("season_id")
    .references(() => seasons.id)
    .notNull(),

  competitionId: uuid("competition_id")
    .references(() => competitions.id)
    .notNull(),

  stageId: uuid("stage_id")
    .references(() => competitionStages.id)
    .notNull(),

  groupId: uuid("group_id")
    .references(() => groups.id),

  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),

  position: integer("position").notNull(),

  played: integer("played")
    .default(0)
    .notNull(),

  wins: integer("wins")
    .default(0)
    .notNull(),

  draws: integer("draws")
    .default(0)
    .notNull(),

  losses: integer("losses")
    .default(0)
    .notNull(),

  goalsFor: integer("goals_for")
    .default(0)
    .notNull(),

  goalsAgainst: integer("goals_against")
    .default(0)
    .notNull(),

  goalDifference: integer("goal_difference")
    .default(0)
    .notNull(),

  points: integer("points")
    .default(0)
    .notNull(),

  form: varchar("form", { length: 10 }),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});