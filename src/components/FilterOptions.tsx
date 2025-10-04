import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface FilterOptionsProps {
  caseSensitive: boolean;
  wholeWords: boolean;
  sortOrder: "asc" | "desc" | "none";
  onCaseSensitiveChange: (checked: boolean) => void;
  onWholeWordsChange: (checked: boolean) => void;
  onSortOrderChange: (value: "asc" | "desc" | "none") => void;
  isOpen: boolean;
}

export const FilterOptions = ({
  caseSensitive,
  wholeWords,
  sortOrder,
  onCaseSensitiveChange,
  onWholeWordsChange,
  onSortOrderChange,
  isOpen,
}: FilterOptionsProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-2xl glass-panel rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2">
      <div className="space-y-3">
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

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Sort Results</Label>
        <RadioGroup value={sortOrder} onValueChange={onSortOrderChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="sort-none" />
            <Label htmlFor="sort-none" className="text-foreground cursor-pointer font-normal">
              No Sorting
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="asc" id="sort-asc" />
            <Label htmlFor="sort-asc" className="text-foreground cursor-pointer font-normal">
              A-Z (Ascending)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="desc" id="sort-desc" />
            <Label htmlFor="sort-desc" className="text-foreground cursor-pointer font-normal">
              Z-A (Descending)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
