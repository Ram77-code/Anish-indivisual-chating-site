import { useState } from "react";
import { useCharacters, useCharacter, useDeleteCharacter, useMessages, useSendMessage, useClearMessages } from "@/hooks/use-characters";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CreateCharacterDialog } from "@/components/CreateCharacterDialog";
import { MessageList } from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  SendHorizontal, 
  Menu, 
  ArrowLeft, 
  MoreVertical, 
  Trash2, 
  MessageSquareOff 
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Queries
  const { data: characters, isLoading: charsLoading } = useCharacters();
  const { data: activeCharacter } = useCharacter(selectedCharId || 0);
  const { data: messages, isLoading: msgsLoading } = useMessages(selectedCharId || 0);

  // Mutations
  const sendMessage = useSendMessage();
  const deleteCharacter = useDeleteCharacter();
  const clearMessages = useClearMessages();

  // Handlers
  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !selectedCharId) return;

    sendMessage.mutate({ 
      characterId: selectedCharId, 
      content: inputValue.trim() 
    });
    setInputValue("");
  };

  const handleDeleteCharacter = (id: number) => {
    if (confirm("Are you sure you want to delete this character?")) {
      deleteCharacter.mutate(id);
      if (selectedCharId === id) setSelectedCharId(null);
    }
  };

  const handleClearHistory = () => {
    if (selectedCharId && confirm("Clear all messages with this character?")) {
      clearMessages.mutate(selectedCharId);
    }
  };

  // Render Sidebar Content (reused for desktop and mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-4 border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold font-display text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Anish AI
        </h1>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {charsLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : characters?.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No characters yet. Create one to start chatting!
          </div>
        ) : (
          characters?.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedCharId(char.id);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left group relative overflow-hidden",
                selectedCharId === char.id 
                  ? "bg-white shadow-md border-primary/20 border ring-1 ring-primary/10" 
                  : "hover:bg-white/60 hover:shadow-sm border border-transparent"
              )}
            >
              <CharacterAvatar name={char.name} src={char.avatarUrl} />
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold truncate text-sm",
                  selectedCharId === char.id ? "text-primary" : "text-foreground"
                )}>
                  {char.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate opacity-80">
                  {char.description}
                </p>
              </div>
              {selectedCharId === char.id && (
                 <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l" />
              )}
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-white/50 backdrop-blur-sm sticky bottom-0 z-10">
        <CreateCharacterDialog />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r h-full shadow-lg shadow-black/5 z-20">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {activeCharacter ? (
          <>
            {/* Chat Header */}
            <header className="h-16 border-b flex items-center px-4 justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <div className="md:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedCharId(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                
                <CharacterAvatar name={activeCharacter.name} src={activeCharacter.avatarUrl} />
                <div>
                  <h2 className="font-semibold text-sm md:text-base leading-tight">
                    {activeCharacter.name}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearHistory}
                  className="hidden sm:flex text-muted-foreground hover:text-orange-600 gap-1.5"
                >
                  <MessageSquareOff className="h-4 w-4" />
                  Clear
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleClearHistory}
                      className="text-orange-600 focus:text-orange-700"
                    >
                      <MessageSquareOff className="mr-2 h-4 w-4" />
                      Clear History
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteCharacter(activeCharacter.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Character
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Chat Messages */}
            <MessageList 
              messages={messages || []} 
              characterName={activeCharacter.name}
              characterAvatar={activeCharacter.avatarUrl}
              isTyping={sendMessage.isPending}
            />

            {/* Input Area */}
            <div className="p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t">
              <form 
                onSubmit={handleSend}
                className="max-w-4xl mx-auto relative flex gap-2 items-end"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Message ${activeCharacter.name}...`}
                  className="rounded-2xl py-6 pr-12 shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                  disabled={sendMessage.isPending}
                  autoFocus
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim() || sendMessage.isPending}
                  className={cn(
                    "rounded-xl h-12 w-12 shrink-0 shadow-md transition-all",
                    inputValue.trim() 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Empty State / Mobile List View
          <div className="flex-1 flex flex-col h-full bg-slate-50/50">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b bg-white dark:bg-slate-950 sticky top-0 z-10 flex justify-between items-center">
               <h1 className="text-xl font-bold font-display text-primary">Anish AI</h1>
               <ThemeToggle />
            </div>

            {/* On Desktop: Welcome Screen */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner text-4xl">
                🤖
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 font-display">Welcome to AI Chat</h2>
              <p className="max-w-md mx-auto mb-8">
                Select a character from the sidebar to start chatting, or create a new personality to talk to.
              </p>
              <div className="flex gap-2">
                <CreateCharacterDialog />
              </div>
            </div>

            {/* On Mobile: Character List is the main view */}
            <div className="md:hidden flex-1 overflow-y-auto">
               <div className="p-4 space-y-2">
                {charsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : characters?.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <p className="mb-4">No characters yet.</p>
                    <CreateCharacterDialog />
                  </div>
                ) : (
                  <>
                    {characters?.map((char) => (
                      <div
                        key={char.id}
                        onClick={() => setSelectedCharId(char.id)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex items-center gap-4 active:scale-[0.98] transition-transform"
                      >
                        <CharacterAvatar name={char.name} src={char.avatarUrl} size="lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{char.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {char.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6">
                      <CreateCharacterDialog />
                    </div>
                  </>
                )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
