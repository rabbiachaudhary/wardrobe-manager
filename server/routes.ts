import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertClothingPieceSchema, insertOutfitSchema, insertWearLogSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const staticDir = path.join(process.cwd(), "static");
const piecesDir = path.join(staticDir, "pieces");
const outfitsDir = path.join(staticDir, "outfits");

if (!fs.existsSync(piecesDir)) fs.mkdirSync(piecesDir, { recursive: true });
if (!fs.existsSync(outfitsDir)) fs.mkdirSync(outfitsDir, { recursive: true });

function deleteImageFile(imagePath: string | null | undefined): void {
  if (!imagePath) return;
  const relativePath = imagePath.replace(/^\/static\//, "");
  const fullPath = path.join(staticDir, relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

const pieceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, piecesDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const outfitStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, outfitsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadPiece = multer({ storage: pieceStorage });
const uploadOutfit = multer({ storage: outfitStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/pieces", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pieces = await storage.getClothingPieces(userId);
      res.json(pieces);
    } catch (error) {
      console.error("Error fetching pieces:", error);
      res.status(500).json({ message: "Failed to fetch pieces" });
    }
  });

  app.post("/api/pieces", isAuthenticated, uploadPiece.single("image"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const body = {
        ...req.body,
        userId,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        imagePath: req.file ? `/static/pieces/${req.file.filename}` : null,
      };

      const validated = insertClothingPieceSchema.parse(body);
      const piece = await storage.createClothingPiece(validated);
      res.status(201).json(piece);
    } catch (error) {
      console.error("Error creating piece:", error);
      res.status(400).json({ message: "Failed to create piece", error: String(error) });
    }
  });

  app.patch("/api/pieces/:id", isAuthenticated, uploadPiece.single("image"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existingPiece = await storage.getClothingPiece(req.params.id);
      
      if (!existingPiece || existingPiece.userId !== userId) {
        return res.status(404).json({ message: "Piece not found" });
      }

      const updateData: any = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.color) updateData.color = req.body.color;
      if (req.body.season) updateData.season = req.body.season;
      if (req.body.tags) updateData.tags = JSON.parse(req.body.tags);
      
      if (req.file) {
        deleteImageFile(existingPiece.imagePath);
        updateData.imagePath = `/static/pieces/${req.file.filename}`;
      }

      const updated = await storage.updateClothingPiece(req.params.id, userId, updateData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating piece:", error);
      res.status(400).json({ message: "Failed to update piece", error: String(error) });
    }
  });

  app.delete("/api/pieces/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const piece = await storage.getClothingPiece(req.params.id);
      
      if (piece && piece.userId === userId) {
        deleteImageFile(piece.imagePath);
      }

      const deleted = await storage.deleteClothingPiece(req.params.id, userId);
      if (deleted) {
        res.json({ message: "Piece deleted" });
      } else {
        res.status(404).json({ message: "Piece not found" });
      }
    } catch (error) {
      console.error("Error deleting piece:", error);
      res.status(500).json({ message: "Failed to delete piece" });
    }
  });

  app.get("/api/outfits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const outfits = await storage.getOutfits(userId);
      res.json(outfits);
    } catch (error) {
      console.error("Error fetching outfits:", error);
      res.status(500).json({ message: "Failed to fetch outfits" });
    }
  });

  app.post("/api/outfits", isAuthenticated, uploadOutfit.single("coverImage"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pieceIds = req.body.pieceIds ? JSON.parse(req.body.pieceIds) : [];
      
      if (pieceIds.length > 0) {
        const ownsAll = await storage.validatePieceOwnership(pieceIds, userId);
        if (!ownsAll) {
          return res.status(403).json({ message: "You don't own all the selected pieces" });
        }
      }
      
      const outfitData = {
        name: req.body.name,
        userId,
        coverImage: req.file ? `/static/outfits/${req.file.filename}` : null,
      };

      const validated = insertOutfitSchema.parse(outfitData);
      const outfit = await storage.createOutfit(validated, pieceIds);
      res.status(201).json(outfit);
    } catch (error) {
      console.error("Error creating outfit:", error);
      res.status(400).json({ message: "Failed to create outfit", error: String(error) });
    }
  });

  app.patch("/api/outfits/:id", isAuthenticated, uploadOutfit.single("coverImage"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existingOutfit = await storage.getOutfit(req.params.id);
      
      if (!existingOutfit || existingOutfit.userId !== userId) {
        return res.status(404).json({ message: "Outfit not found" });
      }

      const updateData: { name?: string; coverImage?: string | null } = {};
      if (req.body.name) updateData.name = req.body.name;
      
      if (req.file) {
        deleteImageFile(existingOutfit.coverImage);
        updateData.coverImage = `/static/outfits/${req.file.filename}`;
      }

      let pieceIds: string[] | undefined;
      if (req.body.pieceIds) {
        pieceIds = JSON.parse(req.body.pieceIds);
        if (pieceIds && pieceIds.length > 0) {
          const ownsAll = await storage.validatePieceOwnership(pieceIds, userId);
          if (!ownsAll) {
            return res.status(403).json({ message: "You don't own all the selected pieces" });
          }
        }
      }

      const updated = await storage.updateOutfit(req.params.id, userId, updateData, pieceIds);
      res.json(updated);
    } catch (error) {
      console.error("Error updating outfit:", error);
      res.status(400).json({ message: "Failed to update outfit", error: String(error) });
    }
  });

  app.delete("/api/outfits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const outfit = await storage.getOutfit(req.params.id);
      
      if (outfit && outfit.userId === userId) {
        deleteImageFile(outfit.coverImage);
      }

      const deleted = await storage.deleteOutfit(req.params.id, userId);
      if (deleted) {
        res.json({ message: "Outfit deleted" });
      } else {
        res.status(404).json({ message: "Outfit not found" });
      }
    } catch (error) {
      console.error("Error deleting outfit:", error);
      res.status(500).json({ message: "Failed to delete outfit" });
    }
  });

  app.post("/api/wear-log", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = {
        ...req.body,
        userId,
        wornDate: req.body.wornDate ? new Date(req.body.wornDate) : new Date(),
      };

      const validated = insertWearLogSchema.parse(logData);
      const log = await storage.createWearLog(validated);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating wear log:", error);
      res.status(400).json({ message: "Failed to create wear log", error: String(error) });
    }
  });

  app.get("/api/wear-log/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const logs = await storage.getRecentWearLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching wear logs:", error);
      res.status(500).json({ message: "Failed to fetch wear logs" });
    }
  });

  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
