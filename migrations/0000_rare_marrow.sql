CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"target" integer NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"completed_days" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'User' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"avatar_url" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'free' NOT NULL,
	"accent_color" text DEFAULT 'classic-dark' NOT NULL
);
