import { type User, type InsertUser, type Subscription, type InsertSubscription, users, subscriptions } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
pool.on("error", (err) => {
  console.error("[pg pool] idle client error:", err.message);
});
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser, verificationToken: string): Promise<User>;
  createUserFromGoogle(data: { googleId: string; email: string; fullName: string; avatarUrl?: string }): Promise<User>;
  verifyUser(id: string): Promise<User>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByPaypalOrderId(paypalOrderId: string): Promise<Subscription | undefined>;
  updateSubscriptionStatus(id: string, status: string): Promise<Subscription>;
  setUserPremium(userId: string, expiresAt: Date): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async createUser(insertUser: InsertUser, verificationToken: string): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id, verificationToken, verified: false })
      .returning();
    return user;
  }

  async createUserFromGoogle(data: { googleId: string; email: string; fullName: string; avatarUrl?: string }): Promise<User> {
    const id = randomUUID();
    const username = data.email.split("@")[0].replace(/[^a-z0-9_]/gi, "_").toLowerCase() + "_" + id.slice(0, 4);
    const [user] = await db
      .insert(users)
      .values({
        id,
        username,
        email: data.email,
        password: "",
        fullName: data.fullName,
        googleId: data.googleId,
        avatarUrl: data.avatarUrl ?? null,
        verified: true,
        verificationToken: null,
      })
      .returning();
    return user;
  }

  async verifyUser(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ verified: true, verificationToken: null })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const [sub] = await db
      .insert(subscriptions)
      .values({ ...subscription, id })
      .returning();
    return sub;
  }

  async getSubscriptionByPaypalOrderId(paypalOrderId: string): Promise<Subscription | undefined> {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.paypalOrderId, paypalOrderId));
    return sub;
  }

  async updateSubscriptionStatus(id: string, status: string): Promise<Subscription> {
    const [sub] = await db
      .update(subscriptions)
      .set({ status })
      .where(eq(subscriptions.id, id))
      .returning();
    return sub;
  }

  async setUserPremium(userId: string, expiresAt: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isPremium: true, premiumExpiresAt: expiresAt })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
