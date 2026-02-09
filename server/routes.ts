import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy", // Fallback for types, but blueprint sets it
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Characters
  app.get(api.characters.list.path, async (req, res) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  app.post(api.characters.create.path, async (req, res) => {
    try {
      const input = api.characters.create.input.parse(req.body);
      const character = await storage.createCharacter(input);
      res.status(201).json(character);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.characters.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const character = await storage.getCharacter(id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.json(character);
  });

  app.patch(api.characters.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const input = api.characters.update.input.parse(req.body);
      const updated = await storage.updateCharacter(id, input);
      if (!updated) return res.status(404).json({ message: "Character not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.characters.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const character = await storage.getCharacter(id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    
    await storage.deleteCharacter(id);
    res.status(204).send();
  });

  // Messages
  app.get(api.messages.list.path, async (req, res) => {
    const characterId = parseInt(req.params.characterId);
    const messages = await storage.getMessages(characterId);
    res.json(messages);
  });

  app.post(api.messages.create.path, async (req, res) => {
    const characterId = parseInt(req.params.characterId);
    try {
      const { content } = api.messages.create.input.parse(req.body);
      
      const character = await storage.getCharacter(characterId);
      if (!character) return res.status(404).json({ message: "Character not found" });

      // 1. Save User Message
      await storage.createMessage({
        characterId,
        role: "user",
        content,
      });

      // 2. Get history
      const history = await storage.getMessages(characterId);
      
      // 3. Prepare OpenAI messages
      const messagesForAI = [
        { role: "system", content: character.systemPrompt },
        ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ];

      // 4. Call OpenAI
      // Note: Replit AI integrations usually support gpt-5.1, gpt-5.2, or gpt-4o-mini
      const response = await openai.chat.completions.create({
        model: "gpt-5.1", // or gpt-4o-mini
        messages: messagesForAI as any,
      });

      const aiContent = response.choices[0].message.content || "...";

      // 5. Save Assistant Message
      const assistantMessage = await storage.createMessage({
        characterId,
        role: "assistant",
        content: aiContent,
      });

      // 6. Return Assistant Message
      res.status(201).json(assistantMessage);

    } catch (err) {
      console.error("Chat Error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.messages.clear.path, async (req, res) => {
    const characterId = parseInt(req.params.characterId);
    await storage.clearMessages(characterId);
    res.status(204).send();
  });

  // Seed data if empty
  const existing = await storage.getCharacters();
  if (existing.length === 0) {
    console.log("Seeding characters...");
    await storage.createCharacter({
      name: "Albert Einstein",
      description: "The theoretical physicist who developed the theory of relativity.",
      systemPrompt: "You are Albert Einstein. You speak with a gentle, thoughtful, and slightly eccentric tone. You are passionate about physics, mathematics, and the mysteries of the universe. Explain complex concepts with simple analogies. Occasionally mention your violin or your dislike for socks.",
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/440px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
    });
    await storage.createCharacter({
      name: "Captain Blackbeard",
      description: "The most feared pirate of the seven seas.",
      systemPrompt: "You are Captain Blackbeard (Edward Teach). You speak in a thick pirate accent ('Yarr', 'Matey', 'Avast'). You are ruthless but charismatic. You love gold, rum, and your ship, the Queen Anne's Revenge. You often threaten to make people walk the plank if they bore you.",
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Edward_Teach_Commonly_Call%27d_Black_Beard.jpg/440px-Edward_Teach_Commonly_Call%27d_Black_Beard.jpg"
    });
    await storage.createCharacter({
      name: "Sherlock Holmes",
      description: "The world's only consulting detective.",
      systemPrompt: "You are Sherlock Holmes. You are highly logical, observant, and slightly arrogant. You notice details others miss. You speak precisely and quickly. You get bored easily without a case. You often deduce things about the user based on their messages.",
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Sherlock_Holmes_Portrait_Paget.jpg"
    });
    await storage.createCharacter({
      name: "Helpful Assistant",
      description: "A friendly and helpful AI assistant.",
      systemPrompt: "You are a helpful, friendly, and polite AI assistant. You answer questions clearly and concisely.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Assistant"
    });
  }

  return httpServer;
}
