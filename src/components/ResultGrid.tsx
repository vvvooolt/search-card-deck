import { useState } from "react";
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

  const extractPmcId = (link: string): string | null => {
    const match = link.match(/PMC(\d{6,7})/);
    return match ? match[1] : null;
  };

  const handleRightClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault(); // Prevent default context menu
    const pmcId = extractPmcId(link);
    if (pmcId) {
      setSelectedPmcId(pmcId);
      setDialogOpen(true);
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
              onContextMenu={(e) => handleRightClick(e, link)}
              className="block p-4 bg-[hsl(var(--result-bg))] hover:bg-[hsl(var(--result-hover))] text-[hsl(var(--result-foreground))] rounded-xl border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
