import { pgTable, serial, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

// 1. Definisikan enum-nya
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "VISITOR"]);

// 2. Pakai di tabel
export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  clerkId: varchar("clerk_id", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 500 }),
  bio: text("bio"),
  role: userRoleEnum("role").notNull(),
  ...timestamps,
});
