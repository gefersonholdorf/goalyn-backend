CREATE TYPE "public"."competition_status" AS ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'FINISHED');--> statement-breakpoint
CREATE TYPE "public"."competition_type" AS ENUM('LEAGUE', 'KNOCKOUT', 'GROUP_KNOCKOUT');--> statement-breakpoint
CREATE TYPE "public"."stage_type" AS ENUM('LEAGUE', 'GROUP', 'KNOCKOUT', 'FINAL');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('PENDING', 'SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."passing_style" AS ENUM('DIRECT', 'MIXED', 'POSSESSION');--> statement-breakpoint
CREATE TYPE "public"."player_position" AS ENUM('GK', 'DEF', 'MID', 'FWD');--> statement-breakpoint
CREATE TYPE "public"."player_role" AS ENUM('Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger');--> statement-breakpoint
CREATE TYPE "public"."pressing_intensity" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."team_mentality" AS ENUM('ULTRA_DEFENSIVE', 'DEFENSIVE', 'BALANCED', 'ATTACKING', 'ULTRA_ATTACKING');--> statement-breakpoint
CREATE TYPE "public"."season_status" AS ENUM('DRAFT', 'ACTIVE', 'FINISHED');--> statement-breakpoint
CREATE TABLE "competition_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"points_win" integer DEFAULT 3 NOT NULL,
	"points_draw" integer DEFAULT 1 NOT NULL,
	"points_loss" integer DEFAULT 0 NOT NULL,
	"home_away" boolean DEFAULT true NOT NULL,
	"away_goal" boolean DEFAULT false NOT NULL,
	"extra_time" boolean DEFAULT true NOT NULL,
	"penalties" boolean DEFAULT true NOT NULL,
	"teams_per_group" integer,
	"teams_advance" integer
);
--> statement-breakpoint
CREATE TABLE "competition_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "stage_type" NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competition_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"team_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "competition_type" NOT NULL,
	"status" "competition_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"team_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stage_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stage_advancements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_stage_id" uuid NOT NULL,
	"to_stage_id" uuid NOT NULL,
	"position_from" integer NOT NULL,
	"position_to" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"stage_id" uuid NOT NULL,
	"group_id" uuid,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"winner_team_id" uuid,
	"home_score" integer,
	"away_score" integer,
	"round" integer,
	"leg" integer DEFAULT 1 NOT NULL,
	"status" "match_status" DEFAULT 'PENDING' NOT NULL,
	"scheduled_at" timestamp,
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_attribute_modifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"attribute_name" varchar(50) NOT NULL,
	"modifier" numeric(5, 2) NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_attributes" (
	"player_id" uuid PRIMARY KEY NOT NULL,
	"pace" integer NOT NULL,
	"strength" integer NOT NULL,
	"stamina" integer NOT NULL,
	"agility" integer NOT NULL,
	"natural_fitness" integer NOT NULL,
	"passing" integer NOT NULL,
	"shooting" integer NOT NULL,
	"dribbling" integer NOT NULL,
	"tackling" integer NOT NULL,
	"heading" integer NOT NULL,
	"technique" integer NOT NULL,
	"first_touch" integer NOT NULL,
	"vision" integer NOT NULL,
	"finishing" integer NOT NULL,
	"handling" integer NOT NULL,
	"reflexes" integer NOT NULL,
	"diving" integer NOT NULL,
	"kicking" integer NOT NULL,
	"throwing" integer NOT NULL,
	"commanding" integer NOT NULL,
	"positioning" integer NOT NULL,
	"decision_making" integer NOT NULL,
	"teamwork" integer NOT NULL,
	"composure" integer NOT NULL,
	"determination" integer NOT NULL,
	"anticipation" integer NOT NULL,
	"bravery" integer NOT NULL,
	"leadership" integer NOT NULL,
	"aggression" integer NOT NULL,
	"concentration" integer NOT NULL,
	"work_rate" integer NOT NULL,
	"luck" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"position" "player_position" NOT NULL,
	"role" "player_role" DEFAULT 'Default' NOT NULL,
	"age" integer DEFAULT 18 NOT NULL,
	"nationality" varchar(80),
	"is_on_field" boolean DEFAULT false NOT NULL,
	"energy" numeric(5, 2) DEFAULT '100' NOT NULL,
	"current_stamina" numeric(5, 2) DEFAULT '100' NOT NULL,
	"condition" numeric(5, 2) DEFAULT '100' NOT NULL,
	"yellow_cards" integer DEFAULT 0 NOT NULL,
	"red_card" boolean DEFAULT false NOT NULL,
	"minutes_played" integer DEFAULT 0 NOT NULL,
	"is_injured" boolean DEFAULT false NOT NULL,
	"injury_duration" integer DEFAULT 0 NOT NULL,
	"goals" integer DEFAULT 0 NOT NULL,
	"assists" integer DEFAULT 0 NOT NULL,
	"shots_on_target" integer DEFAULT 0 NOT NULL,
	"shots_off_target" integer DEFAULT 0 NOT NULL,
	"passes_completed" integer DEFAULT 0 NOT NULL,
	"passes_attempted" integer DEFAULT 0 NOT NULL,
	"tackles" integer DEFAULT 0 NOT NULL,
	"interceptions" integer DEFAULT 0 NOT NULL,
	"fouls" integer DEFAULT 0 NOT NULL,
	"distance_run" numeric(8, 2) DEFAULT '0' NOT NULL,
	"form" numeric(5, 2) DEFAULT '50' NOT NULL,
	"morale" numeric(5, 2) DEFAULT '50' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"year" varchar(10) NOT NULL,
	"status" "season_status" DEFAULT 'DRAFT' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"stage_id" uuid NOT NULL,
	"group_id" uuid,
	"team_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"played" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"goals_for" integer DEFAULT 0 NOT NULL,
	"goals_against" integer DEFAULT 0 NOT NULL,
	"goal_difference" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"form" varchar(10),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"field_position" varchar(20),
	"is_starter" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"formation_name" varchar(50) DEFAULT '4-4-2' NOT NULL,
	"morale" numeric(5, 2) DEFAULT '50' NOT NULL,
	"cohesion" numeric(5, 2) DEFAULT '50' NOT NULL,
	"tactical_familiarity" numeric(5, 2) DEFAULT '50' NOT NULL,
	"substitutions_remaining" integer DEFAULT 5 NOT NULL,
	"mentality" "team_mentality" DEFAULT 'BALANCED' NOT NULL,
	"pressing" "pressing_intensity" DEFAULT 'MEDIUM' NOT NULL,
	"passing_style" "passing_style" DEFAULT 'MIXED' NOT NULL,
	"width" integer DEFAULT 50 NOT NULL,
	"tempo" integer DEFAULT 50 NOT NULL,
	"offensive_width" integer DEFAULT 50 NOT NULL,
	"defensive_width" integer DEFAULT 50 NOT NULL,
	"defensive_line" integer DEFAULT 50 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competition_rules" ADD CONSTRAINT "competition_rules_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_stages" ADD CONSTRAINT "competition_stages_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_teams" ADD CONSTRAINT "competition_teams_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_teams" ADD CONSTRAINT "competition_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_teams" ADD CONSTRAINT "group_teams_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_teams" ADD CONSTRAINT "group_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_stage_id_competition_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."competition_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_advancements" ADD CONSTRAINT "stage_advancements_from_stage_id_competition_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."competition_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_advancements" ADD CONSTRAINT "stage_advancements_to_stage_id_competition_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."competition_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_stage_id_competition_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."competition_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_team_id_teams_id_fk" FOREIGN KEY ("winner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_attribute_modifiers" ADD CONSTRAINT "player_attribute_modifiers_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_stage_id_competition_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."competition_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "team_player_unique" ON "team_players" USING btree ("team_id","player_id");