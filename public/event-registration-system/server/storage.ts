import { db } from "./db";
import { registrations, users, type InsertRegistration, type InsertUser, type Registration, type User } from "@shared/schema";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(filters?: { search?: string; college?: string; domain?: string }): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({ ...insertUser, role: 'admin' }).returning();
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const registrationId = `REG-${randomUUID().slice(0, 8).toUpperCase()}`;
    const [registration] = await db.insert(registrations).values({
      ...insertRegistration,
      registrationId
    }).returning();
    return registration;
  }

  async getRegistrations(filters?: { search?: string; college?: string; domain?: string }): Promise<Registration[]> {
    let conditions = [];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(registrations.name, `%${filters.search}%`),
          ilike(registrations.email, `%${filters.search}%`),
          ilike(registrations.registrationId, `%${filters.search}%`)
        )
      );
    }

    if (filters?.college) {
      conditions.push(ilike(registrations.college, `%${filters.college}%`));
    }

    if (filters?.domain) {
      conditions.push(eq(registrations.domain, filters.domain));
    }

    const query = db.select().from(registrations).orderBy(desc(registrations.createdAt));

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, id));
    return registration;
  }
}

export const storage = new DatabaseStorage();
