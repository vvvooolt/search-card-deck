import { useState, useRef } from "react";
import { SummaryDialog } from "./SummaryDialog";

interface ResultItem {
  Title: string;
  Link?: string;
}

interface ResultGridProps {
  results: ResultItem[];
}

export const ResultGrid = ({ results }: ResultGridProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPmcId, setSelectedPmcId] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const extractPmcId = (link: string): string | null => {
    const match = link.match(/PMC(\d{6,7})/);
    return match ? match[1] : null;
  };

  const handleMouseDown = (link: string) => {
    const pmcId = extractPmcId(link);
    if (!pmcId) return;

    longPressTimer.current = setTimeout(() => {
      setSelectedPmcId(pmcId);
      setDialogOpen(true);
    }, 800); // 800ms hold time
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  if (results.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">No matches found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((item, index) => {
          const link = item.Link || '#';
          const title = item.Title || 'Untitled';

          return (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={(e) => {
                if (e.button === 0) { // Left mouse button only
                  handleMouseDown(link);
                }
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseDown(link)}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseLeave}
              className="block p-4 bg-[hsl(var(--result-bg))] hover:bg-[hsl(var(--result-hover))] text-[hsl(var(--result-foreground))] rounded-xl border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer select-none"
            >
              <span className="text-sm font-medium line-clamp-2">{title}</span>
            </a>
          );
        })}
      </div>

      <SummaryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pmcId={selectedPmcId}
      />
    </>
  );
};
