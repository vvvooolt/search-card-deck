import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOptionsProps {
  caseSensitive: boolean;
  wholeWords: boolean;
  onCaseSensitiveChange: (checked: boolean) => void;
  onWholeWordsChange: (checked: boolean) => void;
  isOpen: boolean;
}

export const FilterOptions = ({
  caseSensitive,
  wholeWords,
  onCaseSensitiveChange,
  onWholeWordsChange,
  isOpen,
}: FilterOptionsProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-2xl glass-panel rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="caseSensitive"
          checked={caseSensitive}
          onCheckedChange={onCaseSensitiveChange}
        />
        <Label htmlFor="caseSensitive" className="text-foreground cursor-pointer">
          Case Sensitive
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="wholeWords"
          checked={wholeWords}
          onCheckedChange={onWholeWordsChange}
        />
        <Label htmlFor="wholeWords" className="text-foreground cursor-pointer">
          Whole Words Only
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Note: These options disable fuzzy search and use exact regex matching.
      </p>
    </div>
  );
};
