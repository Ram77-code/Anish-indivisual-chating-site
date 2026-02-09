import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCharacterSchema, type InsertCharacter } from "@shared/schema";
import { useCreateCharacter } from "@/hooks/use-characters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateCharacterDialog() {
  const [open, setOpen] = useState(false);
  const createCharacter = useCreateCharacter();

  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      name: "",
      description: "",
      systemPrompt: "You are a helpful and friendly AI assistant.",
      avatarUrl: "",
    },
  });

  const onSubmit = (data: InsertCharacter) => {
    createCharacter.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4" />
          New Character
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-display">
              <Sparkles className="h-6 w-6 text-primary" />
              Create Persona
            </DialogTitle>
            <DialogDescription>
              Design a unique AI personality to chat with.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          <Form {...form}>
            <form id="create-character-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sherlock Holmes" {...field} className="bg-muted/50 focus:bg-background transition-colors" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. World's greatest consulting detective" {...field} className="bg-muted/50 focus:bg-background transition-colors" />
                    </FormControl>
                    <FormDescription>Shown in the character list.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personality Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g. You are Sherlock Holmes. You are highly intelligent, observant, but somewhat arrogant. You often deduce things about the user." 
                        className="min-h-[120px] bg-muted/50 focus:bg-background transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This tells the AI how to behave. Be specific!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://..." 
                        {...field} 
                        value={field.value || ""} 
                        className="bg-muted/50 focus:bg-background transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        
        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            type="submit" 
            form="create-character-form"
            disabled={createCharacter.isPending}
            className="min-w-[100px]"
          >
            {createCharacter.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
