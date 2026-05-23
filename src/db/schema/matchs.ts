import {
  boolean,
  integer,
  numeric,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { pgTable } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { teams } from './teams';

export const matchStatusEnum = pgEnum('match_status', [
  'PENDING',     // Pendente
  'SCHEDULED',   // Agendado
  'IN_PROGRESS', // Iniciado
  'FINISHED',    // Finalizado
]);

/* =========================
   MATCHES
========================= */

export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Times
  homeTeamId: uuid('home_team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  
  awayTeamId: uuid('away_team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  
  // Placar
  homeTeamGoals: integer('home_team_goals').default(0).notNull(),
  awayTeamGoals: integer('away_team_goals').default(0).notNull(),
  
  // Status
  status: matchStatusEnum('status')
    .notNull()
    .default('PENDING'),
  
  // Data da partida
  matchDate: timestamp('match_date')
    .notNull()
    .defaultNow(),
  
  // Metadados
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});