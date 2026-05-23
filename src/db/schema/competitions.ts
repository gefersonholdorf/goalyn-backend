import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

import { seasons } from "./seasons";
import { teams } from "./teams";

export const competitionTypeEnum = pgEnum("competition_type", [
  "LEAGUE",
  "KNOCKOUT",
  "GROUP_KNOCKOUT",
]);

export const competitionStatusEnum = pgEnum("competition_status", [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "FINISHED",
]);

export const stageTypeEnum = pgEnum("stage_type", [
  "LEAGUE",
  "GROUP",
  "KNOCKOUT",
  "FINAL",
]);

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),

  seasonId: uuid("season_id")
    .references(() => seasons.id)
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),

  slug: varchar("slug", { length: 255 }).notNull(),

  type: competitionTypeEnum("type").notNull(),

  status: competitionStatusEnum("status")
    .default("DRAFT")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const competitionTeams = pgTable("competition_teams", {
  id: uuid("id").defaultRandom().primaryKey(),

  competitionId: uuid("competition_id")
    .references(() => competitions.id)
    .notNull(),

  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
});

export const competitionStages = pgTable("competition_stages", {
  id: uuid("id").defaultRandom().primaryKey(),

  competitionId: uuid("competition_id")
    .references(() => competitions.id)
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),

  type: stageTypeEnum("type").notNull(),

  order: integer("order").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),

  stageId: uuid("stage_id")
    .references(() => competitionStages.id)
    .notNull(),

  name: varchar("name", { length: 50 }).notNull(),
});

export const groupTeams = pgTable("group_teams", {
  id: uuid("id").defaultRandom().primaryKey(),

  groupId: uuid("group_id")
    .references(() => groups.id)
    .notNull(),

  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
});


export const competitionRules = pgTable("competition_rules", {
  id: uuid("id").defaultRandom().primaryKey(),

  competitionId: uuid("competition_id")
    .references(() => competitions.id)
    .notNull(),

  pointsWin: integer("points_win")
    .default(3)
    .notNull(),

  pointsDraw: integer("points_draw")
    .default(1)
    .notNull(),

  pointsLoss: integer("points_loss")
    .default(0)
    .notNull(),

  homeAway: boolean("home_away")
    .default(true)
    .notNull(),

  awayGoal: boolean("away_goal")
    .default(false)
    .notNull(),

  extraTime: boolean("extra_time")
    .default(true)
    .notNull(),

  penalties: boolean("penalties")
    .default(true)
    .notNull(),

  teamsPerGroup: integer("teams_per_group"),

  teamsAdvance: integer("teams_advance"),
});

export const stageAdvancements = pgTable("stage_advancements", {
  id: uuid("id").defaultRandom().primaryKey(),

  fromStageId: uuid("from_stage_id")
    .references(() => competitionStages.id)
    .notNull(),

  toStageId: uuid("to_stage_id")
    .references(() => competitionStages.id)
    .notNull(),

  positionFrom: integer("position_from").notNull(),

  positionTo: integer("position_to").notNull(),
});