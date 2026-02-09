import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(), // Short bio for the list
  systemPrompt: text("system_prompt").notNull(), // The "personality"
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({ 
  id: true, 
  createdAt: true 
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true, 
  timestamp: true 
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
