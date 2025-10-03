import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pmcId: string | null;
}

export const SummaryDialog = ({ open, onOpenChange, pmcId }: SummaryDialogProps) => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchAndSummarize = async () => {
    if (!pmcId) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Download XML from NCBI
      const xmlUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=${pmcId}&retmode=xml`;
      const xmlResponse = await fetch(xmlUrl);
      
      if (!xmlResponse.ok) {
        throw new Error("Failed to fetch XML from NCBI");
      }

      const xmlBlob = await xmlResponse.blob();
      
      // Send to local Python summarizer
      const formData = new FormData();
      formData.append("file", xmlBlob, "paper.xml");

      const summaryResponse = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        body: formData,
      });

      if (!summaryResponse.ok) {
        throw new Error("Failed to get summary from local endpoint");
      }

      const data = await summaryResponse.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dialog opens with a valid PMC ID
  useEffect(() => {
    if (open && pmcId && !summary && !loading) {
      fetchAndSummarize();
    }
  }, [open, pmcId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Research Paper Summary</DialogTitle>
          <DialogDescription>
            PMC ID: {pmcId}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Downloading and summarizing...
              </span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure your Python script is running on http://localhost:8000
              </p>
            </div>
          )}

          {summary && (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted p-4 rounded-lg">
                {summary}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
