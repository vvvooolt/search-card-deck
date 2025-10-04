import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GeminiConfig {
  name: string;
  projectName: string;
  projectNumber: string;
  key: string;
}

export const ModelDialog = ({ open, onOpenChange }: ModelDialogProps) => {
  const [selectedModel, setSelectedModel] = useState<"local" | "gemini">("local");
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>({
    name: "keeko",
    projectName: "projects/974968693201",
    projectNumber: "974968693201",
    key: "KEY",
  });

  // Load saved settings
  useEffect(() => {
    const savedModel = localStorage.getItem("keeko_model") as "local" | "gemini" | null;
    const savedConfig = localStorage.getItem("keeko_gemini_config");
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    if (savedConfig) {
      try {
        setGeminiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Error parsing gemini config:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("keeko_model", selectedModel);
    if (selectedModel === "gemini") {
      localStorage.setItem("keeko_gemini_config", JSON.stringify(geminiConfig));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Model Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Select Model</Label>
            <RadioGroup value={selectedModel} onValueChange={(value) => setSelectedModel(value as "local" | "gemini")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local" className="font-normal cursor-pointer">Local</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gemini" id="gemini" />
                <Label htmlFor="gemini" className="font-normal cursor-pointer">Gemini</Label>
              </div>
            </RadioGroup>
          </div>

          {selectedModel === "gemini" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={geminiConfig.name}
                  onChange={(e) => setGeminiConfig({ ...geminiConfig, name: e.target.value })}
                  placeholder="keeko"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={geminiConfig.projectName}
                  onChange={(e) => setGeminiConfig({ ...geminiConfig, projectName: e.target.value })}
                  placeholder="projects/974968693201"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectNumber">Project Number</Label>
                <Input
                  id="projectNumber"
                  value={geminiConfig.projectNumber}
                  onChange={(e) => setGeminiConfig({ ...geminiConfig, projectNumber: e.target.value })}
                  placeholder="974968693201"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key">API Key</Label>
                <Input
                  id="key"
                  type="password"
                  value={geminiConfig.key}
                  onChange={(e) => setGeminiConfig({ ...geminiConfig, key: e.target.value })}
                  placeholder="Enter your API key"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
