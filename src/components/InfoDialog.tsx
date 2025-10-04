import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github, Sparkles, Database, Search } from "lucide-react";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InfoDialog = ({ open, onOpenChange }: InfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 animate-scale-in">
            <Sparkles className="h-6 w-6 text-primary" />
            About Keeko
          </DialogTitle>
          <DialogDescription>
            Research finder and AI summarization engine
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Version */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Version 1.8.9 beta</span>
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Project Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our project aims to use open source tools, leveraging one of NASA's open source databases 
              to create a powerful search and summary engine utilizing AI. We combine advanced regex 
              search capabilities with AI-powered summarization to make research more accessible and efficient.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <h3 className="font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Key Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Advanced regex-based search across NASA's research database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>AI-powered document summarization with customizable parameters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Open source architecture for transparency and collaboration</span>
              </li>
            </ul>
          </div>

          {/* GitHub Link */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <Button
              variant="outline"
              className="w-full hover-scale"
              onClick={() => window.open("https://github.com/vvvooolt/Keeko", "_blank")}
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            Built with open source tools • Powered by AI
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
