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
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "team_player_unique" ON "team_players" USING btree ("team_id","player_id");