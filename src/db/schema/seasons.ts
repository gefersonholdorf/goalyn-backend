import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const seasonStatusEnum = pgEnum("season_status", [
  "DRAFT",
  "ACTIVE",
  "FINISHED",
]);

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  year: varchar("year", { length: 10 }).notNull(),

  status: seasonStatusEnum("status")
    .default("DRAFT")
    .notNull(),

  startDate: timestamp("start_date"),

  endDate: timestamp("end_date"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});