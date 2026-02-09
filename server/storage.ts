import { characters, messages, type Character, type InsertCharacter, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc } from "drizzle-orm";

export interface IStorage {
  // Characters
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<void>;

  // Messages
  getMessages(characterId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(characterId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCharacters(): Promise<Character[]> {
    return await db.select().from(characters).orderBy(desc(characters.createdAt));
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(insertCharacter).returning();
    return character;
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    const [updated] = await db
      .update(characters)
      .set(updates)
      .where(eq(characters.id, id))
      .returning();
    return updated;
  }

  async deleteCharacter(id: number): Promise<void> {
    await db.delete(characters).where(eq(characters.id, id));
  }

  async getMessages(characterId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.characterId, characterId))
      .orderBy(asc(messages.timestamp)); // Chat order
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async clearMessages(characterId: number): Promise<void> {
    await db.delete(messages).where(eq(messages.characterId, characterId));
  }
}

export const storage = new DatabaseStorage();
