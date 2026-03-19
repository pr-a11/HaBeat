import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema } from "@shared/schema";

function asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: any) => {
    fn(req, res).catch(next);
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  app.get("/api/habits", asyncHandler(async (_req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  }));

  app.post("/api/habits", asyncHandler(async (req, res) => {
    const parsed = insertHabitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const habit = await storage.createHabit(parsed.data);
    res.status(201).json(habit);
  }));

  app.delete("/api/habits/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await storage.deleteHabit(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  }));

  app.post("/api/habits/:id/toggle", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const { date } = req.body;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "date is required" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "date must be YYYY-MM-DD format" });
    }
    const habit = await storage.toggleDay(id, date);
    if (!habit) return res.status(404).json({ message: "Not found" });
    res.json(habit);
  }));

  app.get("/api/profile", asyncHandler(async (_req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  }));

  app.patch("/api/profile", asyncHandler(async (req, res) => {
    const { name, bio, avatarUrl, accentColor } = req.body;
    const updates: Record<string, string> = {};
    if (typeof name === "string") updates.name = name.slice(0, 100);
    if (typeof bio === "string") updates.bio = bio.slice(0, 500);
    if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl.slice(0, 5000);
    if (typeof accentColor === "string") updates.accentColor = accentColor.slice(0, 50);
    const profile = await storage.updateProfile(updates);
    res.json(profile);
  }));
// Lemon Squeezy Webhook
  app.post("/api/webhook/lemonsqueezy", asyncHandler(async (req, res) => {
    const event = req.headers["x-event-name"] as string;
    
    if (event === "subscription_created" || event === "subscription_updated") {
      const data = req.body?.data?.attributes;
      const email = data?.user_email;
      const status = data?.status;
      
      if (email && status === "active") {
        await storage.updateProfile({ role: "pro", email });
      }
    }
    
    if (event === "subscription_cancelled" || event === "subscription_expired") {
      const data = req.body?.data?.attributes;
      const email = data?.user_email;
      if (email) {
        await storage.updateProfile({ role: "free", email });
      }
    }
    
    res.json({ received: true });
  }));
  return httpServer;
}
