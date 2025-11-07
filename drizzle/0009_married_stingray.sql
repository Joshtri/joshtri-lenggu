ALTER TABLE "posts" ALTER COLUMN "author_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "label_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "type_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_type_id_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."type"("id") ON DELETE no action ON UPDATE no action;