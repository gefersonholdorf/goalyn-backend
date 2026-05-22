import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/* =========================
   ENUMS
========================= */

export const playerPositionEnum = pgEnum('player_position', [
  'GK',
  'DEF',
  'MID',
  'FWD',
]);

export const playerRoleEnum = pgEnum('player_role', [
  'Default',
  'Playmaker',
  'Target Man',
  'Sweeper Keeper',
  'Ball-Playing Defender',
  'Box-to-Box',
  'Poacher',
  'Winger',
]);

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
   PLAYERS
========================= */

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 120 }).notNull(),

  position: playerPositionEnum('position').notNull(),

  role: playerRoleEnum('role')
    .default('Default')
    .notNull(),

  age: integer('age')
    .default(18)
    .notNull(),

  nationality: varchar('nationality', {
    length: 80,
  }),

  isOnField: boolean('is_on_field')
    .default(false)
    .notNull(),

  energy: numeric('energy', {
    precision: 5,
    scale: 2,
  })
    .default('100')
    .notNull(),

  currentStamina: numeric('current_stamina', {
    precision: 5,
    scale: 2,
  })
    .default('100')
    .notNull(),

  condition: numeric('condition', {
    precision: 5,
    scale: 2,
  })
    .default('100')
    .notNull(),

  yellowCards: integer('yellow_cards')
    .default(0)
    .notNull(),

  redCard: boolean('red_card')
    .default(false)
    .notNull(),

  minutesPlayed: integer('minutes_played')
    .default(0)
    .notNull(),

  isInjured: boolean('is_injured')
    .default(false)
    .notNull(),

  injuryDuration: integer('injury_duration')
    .default(0)
    .notNull(),

  goals: integer('goals')
    .default(0)
    .notNull(),

  assists: integer('assists')
    .default(0)
    .notNull(),

  shotsOnTarget: integer('shots_on_target')
    .default(0)
    .notNull(),

  shotsOffTarget: integer('shots_off_target')
    .default(0)
    .notNull(),

  passesCompleted: integer('passes_completed')
    .default(0)
    .notNull(),

  passesAttempted: integer('passes_attempted')
    .default(0)
    .notNull(),

  tackles: integer('tackles')
    .default(0)
    .notNull(),

  interceptions: integer('interceptions')
    .default(0)
    .notNull(),

  fouls: integer('fouls')
    .default(0)
    .notNull(),

  distanceRun: numeric('distance_run', {
    precision: 8,
    scale: 2,
  })
    .default('0')
    .notNull(),

  form: numeric('form', {
    precision: 5,
    scale: 2,
  })
    .default('50')
    .notNull(),

  morale: numeric('morale', {
    precision: 5,
    scale: 2,
  })
    .default('50')
    .notNull(),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});

/* =========================
   PLAYER ATTRIBUTES
========================= */

export const playerAttributes = pgTable(
  'player_attributes',
  {
    playerId: uuid('player_id')
      .references(() => players.id, {
        onDelete: 'cascade',
      })
      .primaryKey(),

    pace: integer('pace').notNull(),
    strength: integer('strength').notNull(),
    stamina: integer('stamina').notNull(),
    agility: integer('agility').notNull(),
    naturalFitness: integer('natural_fitness').notNull(),

    passing: integer('passing').notNull(),
    shooting: integer('shooting').notNull(),
    dribbling: integer('dribbling').notNull(),
    tackling: integer('tackling').notNull(),
    heading: integer('heading').notNull(),

    technique: integer('technique').notNull(),
    firstTouch: integer('first_touch').notNull(),
    vision: integer('vision').notNull(),
    finishing: integer('finishing').notNull(),

    handling: integer('handling').notNull(),
    reflexes: integer('reflexes').notNull(),
    diving: integer('diving').notNull(),
    kicking: integer('kicking').notNull(),
    throwing: integer('throwing').notNull(),
    commanding: integer('commanding').notNull(),

    positioning: integer('positioning').notNull(),
    decisionMaking: integer('decision_making').notNull(),
    teamwork: integer('teamwork').notNull(),
    composure: integer('composure').notNull(),
    determination: integer('determination').notNull(),

    anticipation: integer('anticipation').notNull(),
    bravery: integer('bravery').notNull(),
    leadership: integer('leadership').notNull(),
    aggression: integer('aggression').notNull(),
    concentration: integer('concentration').notNull(),

    workRate: integer('work_rate').notNull(),
    luck: integer('luck').notNull(),
  },
);

/* =========================
   PLAYER ATTRIBUTE MODIFIERS
========================= */

export const playerAttributeModifiers = pgTable(
  'player_attribute_modifiers',
  {
    id: uuid('id')
      .defaultRandom()
      .primaryKey(),

    playerId: uuid('player_id')
      .notNull()
      .references(() => players.id, {
        onDelete: 'cascade',
      }),

    attributeName: varchar('attribute_name', {
      length: 50,
    }).notNull(),

    modifier: numeric('modifier', {
      precision: 5,
      scale: 2,
    }).notNull(),

    expiresAt: timestamp('expires_at'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
);