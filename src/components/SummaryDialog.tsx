import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

      const summaryResponse = await fetch("http://localhost:8080/api/summarize", {
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

  // Fetch when dialog opens or when PMC ID changes
  useEffect(() => {
    if (open && pmcId) {
      setSummary("");
      setError("");
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
                Make sure the summarization service is available at http://localhost:8080/api/summarize
              </p>
            </div>
          )}

          {summary && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }: any) {
                    return (
                      <div className="overflow-x-auto">
                        <table className="border-collapse border border-border">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }: any) {
                    return (
                      <th className="border border-border bg-muted px-4 py-2 font-semibold">
                        {children}
                      </th>
                    );
                  },
                  td({ children }: any) {
                    return (
                      <td className="border border-border px-4 py-2">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
