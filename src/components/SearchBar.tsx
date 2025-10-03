import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterToggle: () => void;
  disabled?: boolean;
}

export const SearchBar = ({ value, onChange, onFilterToggle, disabled }: SearchBarProps) => {
  return (
    <div className="flex gap-3 w-full max-w-2xl">
      <Button
        onClick={onFilterToggle}
        size="icon"
        className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Filter className="h-5 w-5" />
      </Button>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing to search..."
        disabled={disabled}
        className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
};
