import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { SearchBar } from "@/components/SearchBar";
import { FilterOptions } from "@/components/FilterOptions";
import { ResultGrid } from "@/components/ResultGrid";
import { Pagination } from "@/components/Pagination";
import { SystemPromptEditor } from "@/components/SystemPromptEditor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, FileText, Palette, Info } from "lucide-react";
import { parseCSV } from "@/utils/csvParser";
import { useToast } from "@/hooks/use-toast";

const RESULTS_PER_PAGE = 32;

interface DataItem {
  Title: string;
  Link?: string;
}

const Index = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWords, setWholeWords] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);
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

    if (caseSensitive || wholeWords) {
      let pattern = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (wholeWords) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = caseSensitive ? "" : "i";
      try {
        const regex = new RegExp(pattern, flags);
        return data.filter((item) => regex.test(item.Title));
      } catch (e) {
        return [];
      }
    }

    return fuse ? fuse.search(searchQuery).map((r) => r.item) : [];
  }, [searchQuery, data, caseSensitive, wholeWords, fuse]);

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
  }, [searchQuery, caseSensitive, wholeWords]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setPromptEditorOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                System Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Themes", description: "Theme settings coming soon" })}>
                <Palette className="mr-2 h-4 w-4" />
                Themes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Info", description: "Keeko - Research finder through Regex\nVersion 1.0" })}>
                <Info className="mr-2 h-4 w-4" />
                Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="inline-block mb-4 p-4 glass-panel rounded-2xl">
            <div className="w-24 h-24 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Keeko</h1>
          <p className="text-muted-foreground">Research finder through Regex</p>
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
            onCaseSensitiveChange={setCaseSensitive}
            onWholeWordsChange={setWholeWords}
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
    </div>
  );
};

export default Index;
