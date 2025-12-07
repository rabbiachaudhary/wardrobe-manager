import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Categories for clothing pieces
export const CATEGORIES = [
  "Top",
  "Bottom",
  "Dress",
  "Shoes",
  "Jacket",
  "Accessories",
  "Bag",
  "Hat",
] as const;

export const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;

export const COLORS = [
  "Pink",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "White",
  "Black",
  "Brown",
  "Beige",
  "Gray",
  "Multi",
] as const;

export const TAGS = [
  "kawaii",
  "casual",
  "formal",
  "comfy",
  "sporty",
  "elegant",
  "cute",
  "vintage",
  "trendy",
  "minimal",
] as const;

// Clothing pieces table
export const clothingPieces = pgTable("clothing_pieces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  season: varchar("season", { length: 50 }).notNull(),
  tags: text("tags").array(),
  imagePath: varchar("image_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clothingPiecesRelations = relations(clothingPieces, ({ one, many }) => ({
  user: one(users, {
    fields: [clothingPieces.userId],
    references: [users.id],
  }),
  outfitPieces: many(outfitPieces),
}));

export const insertClothingPieceSchema = createInsertSchema(clothingPieces).omit({
  id: true,
  createdAt: true,
});

export type InsertClothingPiece = z.infer<typeof insertClothingPieceSchema>;
export type ClothingPiece = typeof clothingPieces.$inferSelect;

// Outfits table
export const outfits = pgTable("outfits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  coverImage: varchar("cover_image"),
  wornCount: integer("worn_count").default(0),
  lastWorn: timestamp("last_worn"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const outfitsRelations = relations(outfits, ({ one, many }) => ({
  user: one(users, {
    fields: [outfits.userId],
    references: [users.id],
  }),
  outfitPieces: many(outfitPieces),
  wearLogs: many(wearLog),
}));

export const insertOutfitSchema = createInsertSchema(outfits).omit({
  id: true,
  wornCount: true,
  lastWorn: true,
  createdAt: true,
});

export type InsertOutfit = z.infer<typeof insertOutfitSchema>;
export type Outfit = typeof outfits.$inferSelect;

// Outfit pieces junction table
export const outfitPieces = pgTable(
  "outfit_pieces",
  {
    outfitId: varchar("outfit_id").notNull().references(() => outfits.id, { onDelete: "cascade" }),
    pieceId: varchar("piece_id").notNull().references(() => clothingPieces.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.outfitId, table.pieceId] }),
  }),
);

export const outfitPiecesRelations = relations(outfitPieces, ({ one }) => ({
  outfit: one(outfits, {
    fields: [outfitPieces.outfitId],
    references: [outfits.id],
  }),
  piece: one(clothingPieces, {
    fields: [outfitPieces.pieceId],
    references: [clothingPieces.id],
  }),
}));

export type OutfitPiece = typeof outfitPieces.$inferSelect;

// Wear log table
export const wearLog = pgTable("wear_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  outfitId: varchar("outfit_id").notNull().references(() => outfits.id, { onDelete: "cascade" }),
  wornDate: timestamp("worn_date").notNull().defaultNow(),
  location: varchar("location", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wearLogRelations = relations(wearLog, ({ one }) => ({
  user: one(users, {
    fields: [wearLog.userId],
    references: [users.id],
  }),
  outfit: one(outfits, {
    fields: [wearLog.outfitId],
    references: [outfits.id],
  }),
}));

export const insertWearLogSchema = createInsertSchema(wearLog).omit({
  id: true,
  createdAt: true,
});

export type InsertWearLog = z.infer<typeof insertWearLogSchema>;
export type WearLog = typeof wearLog.$inferSelect;

// Extended types for frontend use
export type OutfitWithPieces = Outfit & {
  pieces: ClothingPiece[];
};

export type ClothingPieceWithStats = ClothingPiece & {
  outfitCount: number;
  wornCount: number;
};

export type OutfitWithStats = Outfit & {
  pieces: ClothingPiece[];
  daysSinceWorn: number | null;
};

export type AnalyticsData = {
  totalPieces: number;
  totalOutfits: number;
  totalWears: number;
  neverWornPieces: ClothingPiece[];
  leastWornOutfits: OutfitWithStats[];
  seasonalRecommendations: OutfitWithStats[];
  piecesByCategory: Record<string, number>;
  piecesByColor: Record<string, number>;
};
