import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCharacter, type InsertMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCharacters() {
  return useQuery({
    queryKey: [api.characters.list.path],
    queryFn: async () => {
      const res = await fetch(api.characters.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch characters");
      return api.characters.list.responses[200].parse(await res.json());
    },
  });
}

export function useCharacter(id: number) {
  return useQuery({
    queryKey: [api.characters.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.characters.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch character");
      return api.characters.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCharacter) => {
      const res = await fetch(api.characters.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create character");
      }
      return api.characters.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path] });
      toast({ title: "Success", description: "Character created successfully" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.characters.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete character");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path] });
      toast({ title: "Deleted", description: "Character removed" });
    },
  });
}

export function useMessages(characterId: number) {
  return useQuery({
    queryKey: [api.messages.list.path, characterId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { characterId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!characterId,
    // Poll for new messages every 3 seconds if needed, or rely on mutation updates
    // For a chat app without sockets, invalidate on mutation is key, but maybe poll too
    refetchInterval: 5000, 
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ characterId, content }: { characterId: number; content: string }) => {
      const url = buildUrl(api.messages.create.path, { characterId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      // Invalidate the message list for this character
      queryClient.invalidateQueries({ 
        queryKey: [api.messages.list.path, variables.characterId] 
      });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Failed to send", description: error.message });
    },
  });
}

export function useClearMessages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (characterId: number) => {
      const url = buildUrl(api.messages.clear.path, { characterId });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: (_, characterId) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.messages.list.path, characterId] 
      });
      toast({ title: "Cleared", description: "Chat history cleared" });
    },
  });
}
