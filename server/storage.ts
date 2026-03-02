import { type Habit, type InsertHabit, habits, type Profile, type InsertProfile, profiles } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getHabits(): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  toggleDay(id: number, dateStr: string): Promise<Habit | undefined>;
  getProfile(): Promise<Profile>;
  updateProfile(updates: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getHabits(): Promise<Habit[]> {
    return await db.select().from(habits);
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit;
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values(habit).returning();
    return created;
  }

  async updateHabit(id: number, updates: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [updated] = await db.update(habits).set(updates).where(eq(habits.id, id)).returning();
    return updated;
  }

  async deleteHabit(id: number): Promise<boolean> {
    const [deleted] = await db.delete(habits).where(eq(habits.id, id)).returning();
    return !!deleted;
  }

  async toggleDay(id: number, dateStr: string): Promise<Habit | undefined> {
    const habit = await this.getHabit(id);
    if (!habit) return undefined;

    const completedDays = (habit.completedDays as Record<string, boolean>) || {};
    if (completedDays[dateStr]) {
      delete completedDays[dateStr];
    } else {
      completedDays[dateStr] = true;
    }

    const [updated] = await db
      .update(habits)
      .set({ completedDays })
      .where(eq(habits.id, id))
      .returning();
    return updated;
  }

  async getProfile(): Promise<Profile> {
    const [existing] = await db.select().from(profiles);
    if (existing) return existing;
    const [created] = await db.insert(profiles).values({}).returning();
    return created;
  }

  async updateProfile(updates: Partial<InsertProfile>): Promise<Profile> {
    const profile = await this.getProfile();
    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, profile.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
