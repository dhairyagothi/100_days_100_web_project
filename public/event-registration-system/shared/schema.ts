import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  registrationId: text("registration_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  college: text("college").notNull(),
  year: text("year").notNull(),
  domain: text("domain").notNull(),
  interestAnswer: text("interest_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, role: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, registrationId: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
