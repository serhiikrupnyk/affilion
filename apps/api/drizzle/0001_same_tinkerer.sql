CREATE TABLE "affiliates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(24) DEFAULT 'active' NOT NULL,
	"geos" text DEFAULT '',
	"sources" text DEFAULT '',
	"manager_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "affiliates_email_unique" ON "affiliates" USING btree ("email");