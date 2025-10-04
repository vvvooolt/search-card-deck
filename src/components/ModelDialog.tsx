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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface OpenAIConfig {
  apiKey: string;
}

interface CopilotConfig {
  apiKey: string;
}

interface QwenConfig {
  apiKey: string;
  endpoint: string;
}

type ModelType = "local" | "gemini" | "openai" | "copilot" | "qwen";

export const ModelDialog = ({ open, onOpenChange }: ModelDialogProps) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>("local");
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>({
    name: "keeko",
    projectName: "projects/974968693201",
    projectNumber: "974968693201",
    key: "KEY",
  });
  const [openaiConfig, setOpenaiConfig] = useState<OpenAIConfig>({
    apiKey: "",
  });
  const [copilotConfig, setCopilotConfig] = useState<CopilotConfig>({
    apiKey: "",
  });
  const [qwenConfig, setQwenConfig] = useState<QwenConfig>({
    apiKey: "",
    endpoint: "https://dashscope.aliyuncs.com/api/v1",
  });

  // Load saved settings
  useEffect(() => {
    const savedModel = localStorage.getItem("keeko_model") as ModelType | null;
    const savedGeminiConfig = localStorage.getItem("keeko_gemini_config");
    const savedOpenaiConfig = localStorage.getItem("keeko_openai_config");
    const savedCopilotConfig = localStorage.getItem("keeko_copilot_config");
    const savedQwenConfig = localStorage.getItem("keeko_qwen_config");
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    if (savedGeminiConfig) {
      try {
        setGeminiConfig(JSON.parse(savedGeminiConfig));
      } catch (e) {
        console.error("Error parsing gemini config:", e);
      }
    }
    
    if (savedOpenaiConfig) {
      try {
        setOpenaiConfig(JSON.parse(savedOpenaiConfig));
      } catch (e) {
        console.error("Error parsing openai config:", e);
      }
    }
    
    if (savedCopilotConfig) {
      try {
        setCopilotConfig(JSON.parse(savedCopilotConfig));
      } catch (e) {
        console.error("Error parsing copilot config:", e);
      }
    }
    
    if (savedQwenConfig) {
      try {
        setQwenConfig(JSON.parse(savedQwenConfig));
      } catch (e) {
        console.error("Error parsing qwen config:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("keeko_model", selectedModel);
    if (selectedModel === "gemini") {
      localStorage.setItem("keeko_gemini_config", JSON.stringify(geminiConfig));
    } else if (selectedModel === "openai") {
      localStorage.setItem("keeko_openai_config", JSON.stringify(openaiConfig));
    } else if (selectedModel === "copilot") {
      localStorage.setItem("keeko_copilot_config", JSON.stringify(copilotConfig));
    } else if (selectedModel === "qwen") {
      localStorage.setItem("keeko_qwen_config", JSON.stringify(qwenConfig));
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
            <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="copilot">Copilot</SelectItem>
                <SelectItem value="qwen">Qwen</SelectItem>
              </SelectContent>
            </Select>
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

          {selectedModel === "openai" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiConfig.apiKey}
                  onChange={(e) => setOpenaiConfig({ ...openaiConfig, apiKey: e.target.value })}
                  placeholder="sk-..."
                />
              </div>
            </div>
          )}

          {selectedModel === "copilot" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="copilot-key">API Key</Label>
                <Input
                  id="copilot-key"
                  type="password"
                  value={copilotConfig.apiKey}
                  onChange={(e) => setCopilotConfig({ ...copilotConfig, apiKey: e.target.value })}
                  placeholder="Enter your Copilot API key"
                />
              </div>
            </div>
          )}

          {selectedModel === "qwen" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="qwen-key">API Key</Label>
                <Input
                  id="qwen-key"
                  type="password"
                  value={qwenConfig.apiKey}
                  onChange={(e) => setQwenConfig({ ...qwenConfig, apiKey: e.target.value })}
                  placeholder="Enter your Qwen API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qwen-endpoint">API Endpoint</Label>
                <Input
                  id="qwen-endpoint"
                  value={qwenConfig.endpoint}
                  onChange={(e) => setQwenConfig({ ...qwenConfig, endpoint: e.target.value })}
                  placeholder="https://dashscope.aliyuncs.com/api/v1"
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
