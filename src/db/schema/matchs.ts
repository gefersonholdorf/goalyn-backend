import {
  uuid,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

import { seasons } from "./seasons";
import {
  competitions,
  competitionStages,
  groups,
} from "./competitions";

import { teams } from "./teams";
import { pgTable } from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", [
  "PENDING",
  "SCHEDULED",
  "LIVE",
  "FINISHED",
  "CANCELLED",
]);

export const matches = pgTable("matches", {
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

  homeTeamId: uuid("home_team_id")
    .references(() => teams.id)
    .notNull(),

  awayTeamId: uuid("away_team_id")
    .references(() => teams.id)
    .notNull(),

  winnerTeamId: uuid("winner_team_id")
    .references(() => teams.id),

  homeScore: integer("home_score"),

  awayScore: integer("away_score"),

  round: integer("round"),

  leg: integer("leg")
    .default(1)
    .notNull(),

  status: matchStatusEnum("status")
    .default("PENDING")
    .notNull(),

  scheduledAt: timestamp("scheduled_at"),

  finishedAt: timestamp("finished_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});