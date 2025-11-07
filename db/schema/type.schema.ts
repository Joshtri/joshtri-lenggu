import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { timestamps } from "./columns.helpers";

//master data table.
export const types = pgTable("types", {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    description: text("description"),
    ...timestamps
})