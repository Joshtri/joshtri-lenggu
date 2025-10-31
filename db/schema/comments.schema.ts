import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { posts } from "./posts.schema";
import { users } from "./users.schema";

export const comments = pgTable('comments', {
    id: serial('id').primaryKey().notNull(),
    content: text('content').notNull(),
    authorId: integer('author_id').references(() => users.id),
    postId: integer('post_id').references(() => posts.id),
    parentId: integer('parent_id'), // For nested comments - self-reference
    ...timestamps
});

// Add the self-reference after table definition
export type Comments = typeof comments.$inferSelect;