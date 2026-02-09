import { z } from "zod";
import { insertCharacterSchema, insertMessageSchema, characters, messages } from "./schema";

export const api = {
  characters: {
    list: {
      method: "GET",
      path: "/api/characters",
      responses: {
        200: z.array(z.custom<typeof characters.$inferSelect>()),
      },
    },
    create: {
      method: "POST",
      path: "/api/characters",
      input: insertCharacterSchema,
      responses: {
        201: z.custom<typeof characters.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    get: {
      method: "GET",
      path: "/api/characters/:id",
      responses: {
        200: z.custom<typeof characters.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    update: {
      method: "PATCH",
      path: "/api/characters/:id",
      input: insertCharacterSchema.partial(),
      responses: {
        200: z.custom<typeof characters.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE",
      path: "/api/characters/:id",
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  messages: {
    list: {
      method: "GET",
      path: "/api/characters/:characterId/messages",
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: "POST",
      path: "/api/characters/:characterId/messages",
      input: z.object({
        content: z.string().min(1),
      }),
      responses: {
        201: z.custom<typeof messages.$inferSelect>(), // Returns the ASSISTANT'S response (or maybe the user's? usually we return the new messages)
        // Actually, let's return the assistant message, and the frontend can optimistically add the user message. 
        // Or return both. Let's return the assistant message.
        // Wait, I'll return the assistant message.
      },
    },
    clear: {
      method: "DELETE",
      path: "/api/characters/:characterId/messages",
      responses: {
        204: z.void(),
      }
    }
  },
} as const;

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
