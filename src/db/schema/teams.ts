import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { players } from './players';

/* =========================
   ENUMS (reutilizando os seus)
========================= */

export const teamMentalityEnum = pgEnum('team_mentality', [
  'ULTRA_DEFENSIVE',
  'DEFENSIVE',
  'BALANCED',
  'ATTACKING',
  'ULTRA_ATTACKING',
]);

export const pressingIntensityEnum = pgEnum('pressing_intensity', [
  'LOW',
  'MEDIUM',
  'HIGH',
]);

export const passingStyleEnum = pgEnum('passing_style', [
  'DIRECT',
  'MIXED',
  'POSSESSION',
]);

/* =========================
   TEAMS
========================= */

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 120 }).notNull(),

  formationName: varchar('formation_name', { length: 50 })
    .notNull()
    .default('4-4-2'),

  morale: numeric('morale', { precision: 5, scale: 2 })
    .notNull()
    .default('50'),

  cohesion: numeric('cohesion', { precision: 5, scale: 2 })
    .notNull()
    .default('50'),

  tacticalFamiliarity: numeric('tactical_familiarity', {
    precision: 5,
    scale: 2,
  })
    .notNull()
    .default('50'),

  substitutionsRemaining: integer('substitutions_remaining')
    .notNull()
    .default(5),

  mentality: teamMentalityEnum('mentality')
    .notNull()
    .default('BALANCED'),

  pressing: pressingIntensityEnum('pressing')
    .notNull()
    .default('MEDIUM'),

  passingStyle: passingStyleEnum('passing_style')
    .notNull()
    .default('MIXED'),

  width: integer('width').notNull().default(50),
  tempo: integer('tempo').notNull().default(50),
  offensiveWidth: integer('offensive_width').notNull().default(50),
  defensiveWidth: integer('defensive_width').notNull().default(50),
  defensiveLine: integer('defensive_line').notNull().default(50),

  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow(),
});

/* =========================
   TEAM PLAYERS
========================= */

export const teamPlayers = pgTable(
  'team_players',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, {
        onDelete: 'cascade',
      }),

    playerId: uuid('player_id')
      .notNull()
      .references(() => players.id, {
        onDelete: 'cascade',
      }),

    fieldPosition: varchar('field_position', { length: 20 }),

    isStarter: boolean('is_starter')
      .notNull()
      .default(false),

    createdAt: timestamp('created_at')
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueTeamPlayer: uniqueIndex('team_player_unique').on(
      table.teamId,
      table.playerId,
    ),
  }),
);