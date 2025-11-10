import { sql } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const labels = pgTable('labels', {

    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(), // Hex color code
    description: text('description'),
    ...timestamps

});