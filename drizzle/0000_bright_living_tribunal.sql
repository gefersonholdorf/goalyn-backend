CREATE TYPE "public"."passing_style" AS ENUM('DIRECT', 'MIXED', 'POSSESSION');--> statement-breakpoint
CREATE TYPE "public"."player_position" AS ENUM('GK', 'DEF', 'MID', 'FWD');--> statement-breakpoint
CREATE TYPE "public"."player_role" AS ENUM('Default', 'Playmaker', 'Target Man', 'Sweeper Keeper', 'Ball-Playing Defender', 'Box-to-Box', 'Poacher', 'Winger');--> statement-breakpoint
CREATE TYPE "public"."pressing_intensity" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."team_mentality" AS ENUM('ULTRA_DEFENSIVE', 'DEFENSIVE', 'BALANCED', 'ATTACKING', 'ULTRA_ATTACKING');--> statement-breakpoint
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
ALTER TABLE "player_attribute_modifiers" ADD CONSTRAINT "player_attribute_modifiers_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;