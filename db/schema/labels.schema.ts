import { integer, pgTable, serial, text, varchar, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { sql } from "drizzle-orm";

export const labels = pgTable('labels', {

    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(), // Hex color code
    description: text('description'),
    ...timestamps
});