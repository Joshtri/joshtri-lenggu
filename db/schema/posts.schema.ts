import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { labels } from "./labels.schema";
import { users } from "./users.schema";

export const posts = pgTable('posts', {
    id: serial('id').primaryKey().notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    coverImage: varchar('cover_image', { length: 500 }).notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt').notNull(),
    authorId: integer('author_id').references(() => users.id),
    labelId: integer('label_id').references(() => labels.id),
    ...timestamps
});