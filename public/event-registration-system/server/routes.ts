import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback_secret_for_dev_only';

// Password hashing helpers
function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (scryptSync(password, salt, 64) as Buffer);
  return `${buf.toString("hex")}.${salt}`;
}

function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (scryptSync(supplied, salt, 64) as Buffer);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Auth Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    (req as any).user = user;
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed admin user if it doesn't exist
  async function seedAdmin() {
    try {
      const adminExists = await storage.getUserByEmail('adminzen@event.com');
      if (!adminExists) {
        await storage.createUser({
          email: 'adminzen@event.com',
          password: hashPassword('admin123zen')
        });
        console.log('Seed admin user created: adminzen@event.com / admin123zen');
      }
    } catch (err) {
      console.error('Failed to seed admin:', err);
    }
  }
  
  seedAdmin();

  // Admin Login
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);

      if (!user || !comparePasswords(input.password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ token });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Create Registration
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      
      // Basic check for duplicate email
      const existingRegistrations = await storage.getRegistrations({ search: input.email });
      const isDuplicate = existingRegistrations.some(r => r.email.toLowerCase() === input.email.toLowerCase());
      
      if (isDuplicate) {
         return res.status(400).json({ message: 'Email already registered', field: 'email' });
      }

      const registration = await storage.createRegistration(input);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Get Registrations (Protected)
  app.get(api.registrations.list.path, authenticateToken, async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        college: req.query.college as string,
        domain: req.query.domain as string
      };
      
      const registrations = await storage.getRegistrations(filters);
      res.status(200).json(registrations);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get Analytics (Protected)
  app.get(api.analytics.get.path, authenticateToken, async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      
      const totalRegistrations = registrations.length;
      
      const domainSplit = registrations.reduce((acc, curr) => {
        if (curr.domain === 'Tech') acc.tech++;
        else if (curr.domain === 'Non-Tech') acc.nonTech++;
        return acc;
      }, { tech: 0, nonTech: 0 });

      // Calculate daily registrations
      const dailyMap = new Map<string, number>();
      registrations.forEach(r => {
        // Just take the YYYY-MM-DD part
        const dateStr = r.createdAt.toISOString().split('T')[0];
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
      });

      // Sort by date and map to array
      const dailyRegistrations = Array.from(dailyMap.entries())
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, count]) => ({ date, count }));

      res.status(200).json({
        totalRegistrations,
        domainSplit,
        dailyRegistrations
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return httpServer;
}
