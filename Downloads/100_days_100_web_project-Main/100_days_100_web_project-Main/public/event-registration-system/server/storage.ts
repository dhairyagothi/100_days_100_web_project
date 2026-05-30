import { registrations, users, type InsertRegistration, type InsertUser, type Registration, type User } from "@shared/schema";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import { randomUUID } from "crypto";

let dbInstance: any | null = null;
async function getDb() {
  if (!dbInstance) {
    const module = await import("./db");
    dbInstance = module.db;
  }
  return dbInstance;
}

const useInMemoryStorage = !process.env.DATABASE_URL && process.env.NODE_ENV !== "production";

export interface IStorage {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(filters?: { search?: string; college?: string; domain?: string }): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
}

export class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private registrations: Registration[] = [];
  private nextUserId = 1;
  private nextRegistrationId = 1;

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      email: insertUser.email,
      password: insertUser.password,
      role: "admin",
    } as User;

    this.users.push(user);
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const registration: Registration = {
      id: this.nextRegistrationId++,
      registrationId: `REG-${randomUUID().slice(0, 8).toUpperCase()}`,
      name: insertRegistration.name,
      email: insertRegistration.email,
      college: insertRegistration.college,
      year: insertRegistration.year,
      domain: insertRegistration.domain,
      interestAnswer: insertRegistration.interestAnswer,
      createdAt: new Date(),
    } as Registration;

    this.registrations.unshift(registration);
    return registration;
  }

  async getRegistrations(filters?: { search?: string; college?: string; domain?: string }): Promise<Registration[]> {
    return this.registrations.filter((entry) => {
      const matchesSearch = !filters?.search || [entry.name, entry.email, entry.registrationId]
        .some((field) => field.toLowerCase().includes(filters.search!.toLowerCase()));
      const matchesCollege = !filters?.college || entry.college.toLowerCase().includes(filters.college.toLowerCase());
      const matchesDomain = !filters?.domain || entry.domain === filters.domain;
      return matchesSearch && matchesCollege && matchesDomain;
    });
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.find((entry) => entry.id === id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDb();
    const [user] = await db.insert(users).values({ ...insertUser, role: 'admin' }).returning();
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const db = await getDb();
    const registrationId = `REG-${randomUUID().slice(0, 8).toUpperCase()}`;
    const [registration] = await db.insert(registrations).values({
      ...insertRegistration,
      registrationId
    }).returning();
    return registration;
  }

  async getRegistrations(filters?: { search?: string; college?: string; domain?: string }): Promise<Registration[]> {
    const db = await getDb();
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
    const db = await getDb();
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, id));
    return registration;
  }
}

export const storage = useInMemoryStorage ? new InMemoryStorage() : new DatabaseStorage();
