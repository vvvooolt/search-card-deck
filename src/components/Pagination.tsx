import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "default" : "secondary"}
          size="sm"
          disabled={page === currentPage}
          className={
            page === currentPage
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-secondary text-foreground"
          }
        >
          {page}
        </Button>
      ))}
    </div>
  );
};
