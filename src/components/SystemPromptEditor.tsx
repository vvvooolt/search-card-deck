import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SystemPromptEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE = "http://localhost:3414";

export const SystemPromptEditor = ({ open, onOpenChange }: SystemPromptEditorProps) => {
  const [prompt, setPrompt] = useState("");
  const [wordCount, setWordCount] = useState<number>(250);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadPrompt();
    }
  }, [open]);

  const loadPrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/system-prompt`);
      if (!response.ok) throw new Error("Failed to load system prompt");
      const data = await response.json();
      setPrompt(data.prompt);
      
      // Extract existing word count goal if present
      const wordCountMatch = data.prompt.match(/word count goal is (\d+)/i);
      if (wordCountMatch) {
        setWordCount(parseInt(wordCountMatch[1]));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load system prompt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async () => {
    setSaving(true);
    try {
      // Remove any existing word count goal text
      let updatedPrompt = prompt.replace(/word count goal is \d+\.?\s*/gi, "");
      
      // Add the word count goal at the end
      updatedPrompt = updatedPrompt.trim() + ` word count goal is ${wordCount}.`;
      
      const response = await fetch(`${API_BASE}/api/system-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: updatedPrompt }),
      });
      if (!response.ok) throw new Error("Failed to save system prompt");
      toast({
        title: "Success",
        description: "System prompt saved successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system prompt",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit System Prompt</DialogTitle>
          <DialogDescription>
            Customize the AI system prompt for document summarization
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Word Count Goal
              </label>
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                min="0"
                className="w-32"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                System Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter system prompt..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={savePrompt} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
