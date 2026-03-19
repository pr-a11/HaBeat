import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "habeat-secret-2026";

function asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: any) => {
    fn(req, res).catch(next);
  };
}

function authMiddleware(req: any, res: Response, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // Health
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // REGISTER
  app.post("/api/auth/register", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be 6+ characters" });
    
    const existing = await storage.getUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already registered" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await storage.createUser({ email, password: hashed });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  }));

  // LOGIN
  app.post("/api/auth/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    
    const user = await storage.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { id: user.id, email: user.email } });
  }));

  // HABITS
  app.get("/api/habits", authMiddleware, asyncHandler(async (req: any, res) => {
    const habits = await storage.getHabits(req.userId);
    res.json(habits);
  }));

  app.post("/api/habits", authMiddleware, asyncHandler(async (req: any, res) => {
    const parsed = insertHabitSchema.safeParse({ ...req.body, userId: req.userId });
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const habit = await storage.createHabit(parsed.data);
    res.status(201).json(habit);
  }));

  app.delete("/api/habits/:id", authMiddleware, asyncHandler(async (req: any, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await storage.deleteHabit(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  }));

  app.post("/api/habits/:id/toggle", authMiddleware, asyncHandler(async (req: any, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "date required" });
    const habit = await storage.toggleDay(id, date);
    if (!habit) return res.status(404).json({ message: "Not found" });
    res.json(habit);
  }));

  // PROFILE
  app.get("/api/profile", authMiddleware, asyncHandler(async (req: any, res) => {
    const profile = await storage.getProfile(req.userId);
    res.json(profile);
  }));

  app.patch("/api/profile", authMiddleware, asyncHandler(async (req: any, res) => {
    const { name, bio, avatarUrl, accentColor } = req.body;
    const updates: Record<string, string> = {};
    if (typeof name === "string") updates.name = name.slice(0, 100);
    if (typeof bio === "string") updates.bio = bio.slice(0, 500);
    if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl.slice(0, 500000);
    if (typeof accentColor === "string") updates.accentColor = accentColor.slice(0, 50);
    const profile = await storage.updateProfile(req.userId, updates);
    res.json(profile);
  }));

  // WEBHOOK
  app.post("/api/webhook/lemonsqueezy", asyncHandler(async (req, res) => {
    const event = req.headers["x-event-name"] as string;
    if (event === "subscription_created" || event === "subscription_updated") {
      const data = req.body?.data?.attributes;
      const email = data?.user_email;
      const status = data?.status;
      if (email && status === "active") {
        const user = await storage.getUserByEmail(email);
        if (user) await storage.updateProfile(user.id, { role: "pro" });
      }
    }
    if (event === "subscription_cancelled" || event === "subscription_expired") {
      const data = req.body?.data?.attributes;
      const email = data?.user_email;
      if (email) {
        const user = await storage.getUserByEmail(email);
        if (user) await storage.updateProfile(user.id, { role: "free" });
      }
    }
    res.json({ received: true });
  }));

  return httpServer;
}
