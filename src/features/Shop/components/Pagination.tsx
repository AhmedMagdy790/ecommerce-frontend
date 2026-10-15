interface PaginationProps {
  data: {
    currentPage: number;
    totalPages: number;
  };

  onPageChange: (page: number) => void;
}

export default function Pagination({
  data,
  onPageChange,
}: PaginationProps) {

  const { currentPage, totalPages } = data;

  if (totalPages <= 1) {
    return null;
  }

  function getPages() {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }


  return (
    <div className="mt-10 flex justify-center gap-2">

      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-border px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>


      {/* Pages */}
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            rounded-lg px-4 py-2
            ${
              page === currentPage
                ? "bg-primary text-white"
                : "border border-border"
            }
          `}
        >
          {page}
        </button>
      ))}


      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-border px-4 py-2 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}