CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliate_id" integer NOT NULL,
	"offer_id" integer NOT NULL,
	"link_uid" text NOT NULL,
	"split" text DEFAULT '100',
	"utm_template" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "links_link_uid_unique" UNIQUE("link_uid")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"name" text NOT NULL,
	"payout_type" text DEFAULT 'cpa' NOT NULL,
	"payout_value" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"landing_urls" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
