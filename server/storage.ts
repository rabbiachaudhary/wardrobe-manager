import {
  users,
  clothingPieces,
  outfits,
  outfitPieces,
  wearLog,
  type User,
  type UpsertUser,
  type ClothingPiece,
  type InsertClothingPiece,
  type Outfit,
  type InsertOutfit,
  type WearLog,
  type InsertWearLog,
  type OutfitWithPieces,
  type AnalyticsData,
  type OutfitWithStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, isNull, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getClothingPieces(userId: string): Promise<ClothingPiece[]>;
  getClothingPiece(id: string): Promise<ClothingPiece | undefined>;
  createClothingPiece(piece: InsertClothingPiece): Promise<ClothingPiece>;
  updateClothingPiece(id: string, userId: string, data: Partial<InsertClothingPiece>): Promise<ClothingPiece | undefined>;
  deleteClothingPiece(id: string, userId: string): Promise<boolean>;
  validatePieceOwnership(pieceIds: string[], userId: string): Promise<boolean>;

  getOutfits(userId: string): Promise<OutfitWithPieces[]>;
  getOutfit(id: string): Promise<OutfitWithPieces | undefined>;
  createOutfit(outfit: InsertOutfit, pieceIds: string[]): Promise<OutfitWithPieces>;
  updateOutfit(id: string, userId: string, data: { name?: string; coverImage?: string | null }, pieceIds?: string[]): Promise<OutfitWithPieces | undefined>;
  deleteOutfit(id: string, userId: string): Promise<boolean>;

  createWearLog(log: InsertWearLog): Promise<WearLog>;
  getRecentWearLogs(userId: string, limit?: number): Promise<(WearLog & { outfit: Outfit })[]>;

  getAnalytics(userId: string): Promise<AnalyticsData>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getClothingPieces(userId: string): Promise<ClothingPiece[]> {
    return await db
      .select()
      .from(clothingPieces)
      .where(eq(clothingPieces.userId, userId))
      .orderBy(desc(clothingPieces.createdAt));
  }

  async getClothingPiece(id: string): Promise<ClothingPiece | undefined> {
    const [piece] = await db
      .select()
      .from(clothingPieces)
      .where(eq(clothingPieces.id, id));
    return piece;
  }

  async createClothingPiece(piece: InsertClothingPiece): Promise<ClothingPiece> {
    const [created] = await db
      .insert(clothingPieces)
      .values(piece)
      .returning();
    return created;
  }

  async updateClothingPiece(id: string, userId: string, data: Partial<InsertClothingPiece>): Promise<ClothingPiece | undefined> {
    const [updated] = await db
      .update(clothingPieces)
      .set(data)
      .where(and(eq(clothingPieces.id, id), eq(clothingPieces.userId, userId)))
      .returning();
    return updated;
  }

  async deleteClothingPiece(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(clothingPieces)
      .where(and(eq(clothingPieces.id, id), eq(clothingPieces.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async validatePieceOwnership(pieceIds: string[], userId: string): Promise<boolean> {
    if (pieceIds.length === 0) return true;
    const pieces = await db
      .select()
      .from(clothingPieces)
      .where(and(inArray(clothingPieces.id, pieceIds), eq(clothingPieces.userId, userId)));
    return pieces.length === pieceIds.length;
  }

  async getOutfits(userId: string): Promise<OutfitWithPieces[]> {
    const outfitList = await db
      .select()
      .from(outfits)
      .where(eq(outfits.userId, userId))
      .orderBy(desc(outfits.createdAt));

    const result: OutfitWithPieces[] = [];
    for (const outfit of outfitList) {
      const pieces = await this.getOutfitPieces(outfit.id);
      result.push({ ...outfit, pieces });
    }
    return result;
  }

  async getOutfit(id: string): Promise<OutfitWithPieces | undefined> {
    const [outfit] = await db.select().from(outfits).where(eq(outfits.id, id));
    if (!outfit) return undefined;
    const pieces = await this.getOutfitPieces(id);
    return { ...outfit, pieces };
  }

  private async getOutfitPieces(outfitId: string): Promise<ClothingPiece[]> {
    const junctions = await db
      .select()
      .from(outfitPieces)
      .where(eq(outfitPieces.outfitId, outfitId));
    
    if (junctions.length === 0) return [];
    
    const pieceIds = junctions.map(j => j.pieceId);
    return await db
      .select()
      .from(clothingPieces)
      .where(inArray(clothingPieces.id, pieceIds));
  }

  async createOutfit(outfit: InsertOutfit, pieceIds: string[]): Promise<OutfitWithPieces> {
    const [created] = await db.insert(outfits).values(outfit).returning();
    
    if (pieceIds.length > 0) {
      await db.insert(outfitPieces).values(
        pieceIds.map(pieceId => ({ outfitId: created.id, pieceId }))
      );
    }

    const pieces = await this.getOutfitPieces(created.id);
    return { ...created, pieces };
  }

  async updateOutfit(id: string, userId: string, data: { name?: string; coverImage?: string | null }, pieceIds?: string[]): Promise<OutfitWithPieces | undefined> {
    const [updated] = await db
      .update(outfits)
      .set(data)
      .where(and(eq(outfits.id, id), eq(outfits.userId, userId)))
      .returning();
    
    if (!updated) return undefined;

    if (pieceIds !== undefined) {
      await db.delete(outfitPieces).where(eq(outfitPieces.outfitId, id));
      if (pieceIds.length > 0) {
        await db.insert(outfitPieces).values(
          pieceIds.map(pieceId => ({ outfitId: id, pieceId }))
        );
      }
    }

    const pieces = await this.getOutfitPieces(id);
    return { ...updated, pieces };
  }

  async deleteOutfit(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(outfits)
      .where(and(eq(outfits.id, id), eq(outfits.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async createWearLog(log: InsertWearLog): Promise<WearLog> {
    const [created] = await db.insert(wearLog).values(log).returning();
    
    await db
      .update(outfits)
      .set({
        wornCount: sql`${outfits.wornCount} + 1`,
        lastWorn: new Date(),
      })
      .where(eq(outfits.id, log.outfitId));

    return created;
  }

  async getRecentWearLogs(userId: string, limit = 10): Promise<(WearLog & { outfit: Outfit })[]> {
    const logs = await db
      .select()
      .from(wearLog)
      .where(eq(wearLog.userId, userId))
      .orderBy(desc(wearLog.wornDate))
      .limit(limit);

    const result: (WearLog & { outfit: Outfit })[] = [];
    for (const log of logs) {
      const [outfit] = await db.select().from(outfits).where(eq(outfits.id, log.outfitId));
      if (outfit) {
        result.push({ ...log, outfit });
      }
    }
    return result;
  }

  async getAnalytics(userId: string): Promise<AnalyticsData> {
    const allPieces = await this.getClothingPieces(userId);
    const allOutfits = await this.getOutfits(userId);
    const allLogs = await db
      .select()
      .from(wearLog)
      .where(eq(wearLog.userId, userId));

    const piecesByCategory: Record<string, number> = {};
    const piecesByColor: Record<string, number> = {};
    
    for (const piece of allPieces) {
      piecesByCategory[piece.category] = (piecesByCategory[piece.category] || 0) + 1;
      piecesByColor[piece.color] = (piecesByColor[piece.color] || 0) + 1;
    }

    const piecesInOutfits = new Set<string>();
    for (const outfit of allOutfits) {
      for (const piece of outfit.pieces) {
        piecesInOutfits.add(piece.id);
      }
    }

    const neverWornPieces = allPieces.filter(p => !piecesInOutfits.has(p.id));

    const leastWornOutfits: OutfitWithStats[] = allOutfits
      .sort((a, b) => (a.wornCount ?? 0) - (b.wornCount ?? 0))
      .slice(0, 5)
      .map(o => ({
        ...o,
        daysSinceWorn: o.lastWorn 
          ? Math.floor((Date.now() - new Date(o.lastWorn).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      }));

    const currentMonth = new Date().getMonth();
    const currentSeason = 
      currentMonth >= 2 && currentMonth <= 4 ? "Spring" :
      currentMonth >= 5 && currentMonth <= 7 ? "Summer" :
      currentMonth >= 8 && currentMonth <= 10 ? "Fall" : "Winter";

    const seasonalPieceIds = new Set(
      allPieces.filter(p => p.season === currentSeason).map(p => p.id)
    );

    const seasonalRecommendations: OutfitWithStats[] = allOutfits
      .filter(o => o.pieces.some(p => seasonalPieceIds.has(p.id)))
      .sort((a, b) => (a.wornCount ?? 0) - (b.wornCount ?? 0))
      .slice(0, 5)
      .map(o => ({
        ...o,
        daysSinceWorn: o.lastWorn 
          ? Math.floor((Date.now() - new Date(o.lastWorn).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      }));

    return {
      totalPieces: allPieces.length,
      totalOutfits: allOutfits.length,
      totalWears: allLogs.length,
      neverWornPieces,
      leastWornOutfits,
      seasonalRecommendations,
      piecesByCategory,
      piecesByColor,
    };
  }
}

export const storage = new DatabaseStorage();
