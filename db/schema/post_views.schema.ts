import { sql } from 'drizzle-orm';
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts.schema";

export const postViews = pgTable('post_views', {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    postId: uuid('post_id').references(() => posts.id).notNull(),
    viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow().notNull(),
});
