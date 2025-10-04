import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { SearchBar } from "@/components/SearchBar";
import { FilterOptions } from "@/components/FilterOptions";
import { ResultGrid } from "@/components/ResultGrid";
import { Pagination } from "@/components/Pagination";
import { SystemPromptEditor } from "@/components/SystemPromptEditor";
import { InfoDialog } from "@/components/InfoDialog";
import { ThemeDialog } from "@/components/ThemeDialog";
import { ModelDialog } from "@/components/ModelDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, FileText, Palette, Info, BrainCircuit } from "lucide-react";
import { parseCSV } from "@/utils/csvParser";
import { useToast } from "@/hooks/use-toast";
import { ParticleBackground } from "@/components/ParticleBackground";

const RESULTS_PER_PAGE = 32;

interface DataItem {
  Title: string;
  Link?: string;
  score?: number;
}

const Index = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWords, setWholeWords] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none" | "relevance">("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load CSV data
  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const parsed = parseCSV(csvText);
        setData(parsed as unknown as DataItem[]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setIsLoading(false);
      });
  }, []);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    if (!data.length) return null;
    return new Fuse(data, {
      keys: ["Title"],
      threshold: 0.4,
    });
  }, [data]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery || !data.length) return [];

    let results: DataItem[] = [];

    if (caseSensitive || wholeWords) {
      let pattern = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (wholeWords) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = caseSensitive ? "" : "i";
      try {
        const regex = new RegExp(pattern, flags);
        results = data.filter((item) => regex.test(item.Title)).map(item => ({ ...item, score: 0 }));
      } catch (e) {
        results = [];
      }
    } else {
      // Keep Fuse.js scores for relevance sorting
      const fuseResults = fuse ? fuse.search(searchQuery) : [];
      results = fuseResults.map((r) => ({ ...r.item, score: r.score }));
    }

    // Apply sorting
    if (sortOrder === "relevance") {
      // Sort by Fuse.js score (lower is more relevant)
      results = [...results].sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
    } else if (sortOrder !== "none") {
      results = [...results].sort((a, b) => {
        const titleA = a.Title.toLowerCase();
        const titleB = b.Title.toLowerCase();
        if (sortOrder === "asc") {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    }

    return results;
  }, [searchQuery, data, caseSensitive, wholeWords, sortOrder, fuse]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    return filteredResults.slice(startIndex, endIndex);
  }, [filteredResults, currentPage]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, caseSensitive, wholeWords, sortOrder]);

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Settings className="h-15 w-15" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setPromptEditorOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                System Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModelDialogOpen(true)}>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Model
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemeDialogOpen(true)}>
                <Palette className="mr-2 h-4 w-4" />
                Themes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInfoDialogOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <h1 className="text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Keeko
          </h1>
          <p className="text-lg text-muted-foreground mb-6">Research finder through Regex</p>
          
          {/* Stats Cards */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="glass-panel px-6 py-3 rounded-xl">
              <div className="text-2xl font-bold text-primary">{data.length}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="glass-panel px-6 py-3 rounded-xl">
              <div className="text-2xl font-bold text-accent">{filteredResults.length}</div>
              <div className="text-xs text-muted-foreground">Results Found</div>
            </div>
            <div className="glass-panel px-6 py-3 rounded-xl">
              <div className="text-2xl font-bold text-primary">
                {searchQuery ? Math.round((filteredResults.length / data.length) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Match Rate</div>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterToggle={() => setFilterOpen(!filterOpen)}
            disabled={isLoading}
          />
          <FilterOptions
            caseSensitive={caseSensitive}
            wholeWords={wholeWords}
            sortOrder={sortOrder}
            onCaseSensitiveChange={setCaseSensitive}
            onWholeWordsChange={setWholeWords}
            onSortOrderChange={setSortOrder}
            isOpen={filterOpen}
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : searchQuery ? (
          <>
            <ResultGrid results={paginatedResults} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Start typing to see results</p>
          </div>
        )}
      </div>
      
      <SystemPromptEditor 
        open={promptEditorOpen} 
        onOpenChange={setPromptEditorOpen} 
      />
      
      <ModelDialog 
        open={modelDialogOpen} 
        onOpenChange={setModelDialogOpen} 
      />
      
      <InfoDialog 
        open={infoDialogOpen} 
        onOpenChange={setInfoDialogOpen} 
      />
      
      <ThemeDialog 
        open={themeDialogOpen} 
        onOpenChange={setThemeDialogOpen} 
      />
    </div>
  );
};

export default Index;
