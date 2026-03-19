import { type Habit, type InsertHabit, habits, type Profile, type InsertProfile, profiles, type User, type InsertUser, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Habits
  getHabits(userId: number): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: number): Promise<boolean>;
  toggleDay(id: number, dateStr: string): Promise<Habit | undefined>;
  // Profile
  getProfile(userId: number): Promise<Profile>;
  updateProfile(userId: number, updates: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getHabits(userId: number): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values(habit).returning();
    return created;
  }

  async deleteHabit(id: number): Promise<boolean> {
    const [deleted] = await db.delete(habits).where(eq(habits.id, id)).returning();
    return !!deleted;
  }

  async toggleDay(id: number, dateStr: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    if (!habit) return undefined;
    const completedDays = (habit.completedDays as Record<string, boolean>) || {};
    if (completedDays[dateStr]) {
      delete completedDays[dateStr];
    } else {
      completedDays[dateStr] = true;
    }
    const [updated] = await db.update(habits).set({ completedDays }).where(eq(habits.id, id)).returning();
    return updated;
  }

  async getProfile(userId: number): Promise<Profile> {
    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (existing) return existing;
    const [created] = await db.insert(profiles).values({ userId }).returning();
    return created;
  }

  async updateProfile(userId: number, updates: Partial<InsertProfile>): Promise<Profile> {
    const profile = await this.getProfile(userId);
    const [updated] = await db.update(profiles).set(updates).where(eq(profiles.id, profile.id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
