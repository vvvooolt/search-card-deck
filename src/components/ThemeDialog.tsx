import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  border: string;
  input: string;
  ring: string;
  "result-bg": string;
  "result-hover": string;
  "result-foreground": string;
}

const PRESET_THEMES: Record<string, ThemeColors> = {
  "Catppuccin Mocha": {
    background: "240 21% 15%",
    foreground: "227 68% 88%",
    card: "240 21% 18%",
    "card-foreground": "227 68% 88%",
    primary: "197 97% 75%",
    "primary-foreground": "240 21% 15%",
    secondary: "249 15% 28%",
    "secondary-foreground": "227 68% 88%",
    muted: "240 21% 22%",
    "muted-foreground": "228 17% 64%",
    accent: "115 54% 76%",
    "accent-foreground": "240 21% 15%",
    border: "249 15% 28%",
    input: "249 15% 28%",
    ring: "197 97% 75%",
    "result-bg": "197 97% 75%",
    "result-hover": "115 54% 76%",
    "result-foreground": "240 21% 15%",
  },
  "Gruvbox Dark": {
    background: "0 0% 16%",
    foreground: "35 26% 91%",
    card: "0 0% 20%",
    "card-foreground": "35 26% 91%",
    primary: "39 67% 69%",
    "primary-foreground": "0 0% 16%",
    secondary: "0 0% 27%",
    "secondary-foreground": "35 26% 91%",
    muted: "0 0% 24%",
    "muted-foreground": "35 16% 65%",
    accent: "142 45% 58%",
    "accent-foreground": "0 0% 16%",
    border: "0 0% 27%",
    input: "0 0% 27%",
    ring: "39 67% 69%",
    "result-bg": "39 67% 69%",
    "result-hover": "142 45% 58%",
    "result-foreground": "0 0% 16%",
  },
  "Dracula+": {
    background: "231 15% 18%",
    foreground: "60 30% 96%",
    card: "232 14% 22%",
    "card-foreground": "60 30% 96%",
    primary: "265 89% 78%",
    "primary-foreground": "231 15% 18%",
    secondary: "232 14% 31%",
    "secondary-foreground": "60 30% 96%",
    muted: "231 15% 26%",
    "muted-foreground": "233 15% 59%",
    accent: "326 100% 74%",
    "accent-foreground": "231 15% 18%",
    border: "232 14% 31%",
    input: "232 14% 31%",
    ring: "265 89% 78%",
    "result-bg": "265 89% 78%",
    "result-hover": "326 100% 74%",
    "result-foreground": "231 15% 18%",
  },
  "Neon Hacker": {
    background: "0 0% 5%",
    foreground: "120 100% 75%",
    card: "0 0% 8%",
    "card-foreground": "120 100% 75%",
    primary: "120 100% 50%",
    "primary-foreground": "0 0% 5%",
    secondary: "0 0% 15%",
    "secondary-foreground": "120 100% 75%",
    muted: "0 0% 12%",
    "muted-foreground": "120 50% 50%",
    accent: "180 100% 50%",
    "accent-foreground": "0 0% 5%",
    border: "120 100% 30%",
    input: "0 0% 15%",
    ring: "120 100% 50%",
    "result-bg": "120 100% 85%",
    "result-hover": "180 100% 85%",
    "result-foreground": "0 0% 5%",
  },
};

const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = lDecimal;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    r = hue2rgb(p, q, hDecimal + 1 / 3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export function ThemeDialog({ open, onOpenChange }: ThemeDialogProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : PRESET_THEMES["Catppuccin Mocha"];
  });

  const applyTheme = (theme: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const handlePresetSelect = (presetName: string) => {
    setCurrentTheme(PRESET_THEMES[presetName]);
  };

  const handleColorChange = (key: keyof ThemeColors, hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    setCurrentTheme((prev) => ({ ...prev, [key]: hslValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Theme Settings</DialogTitle>
          <DialogDescription>
            Choose a preset theme or customize colors to your liking
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(PRESET_THEMES).map((themeName) => (
                <Button
                  key={themeName}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
                  onClick={() => handlePresetSelect(themeName)}
                >
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor: `hsl(${PRESET_THEMES[themeName].primary})`,
                      }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        backgroundColor: `hsl(${PRESET_THEMES[themeName].accent})`,
                      }}
                    />
                  </div>
                  <span className="font-medium">{themeName}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="py-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4">
                {(Object.keys(currentTheme) as Array<keyof ThemeColors>).map((colorKey) => (
                  <div key={colorKey} className="flex items-center gap-4 p-3 rounded-lg glass-panel">
                    <div className="flex-1">
                      <Label className="capitalize text-sm font-medium">
                        {colorKey.replace(/-/g, " ")}
                      </Label>
                    </div>
                    <Input
                      type="color"
                      value={hslToHex(currentTheme[colorKey])}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <code className="text-xs text-muted-foreground font-mono">
                      {currentTheme[colorKey]}
                    </code>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-6 pt-4 border-t flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
