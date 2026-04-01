import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const ADMIN_TABLE_PAGE_SIZE = 4;

/**
 * Client-side table pagination (default 4 rows per page).
 */
export default function AdminTablePagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <div className="admin-pagination" role="navigation" aria-label="Table pagination">
      <span className="admin-pagination-meta">
        Showing <strong>{from}</strong>–<strong>{to}</strong> of <strong>{total}</strong>
      </span>
      <div className="admin-pagination-actions">
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          <FiChevronLeft size={18} aria-hidden />
          <span>Prev</span>
        </button>
        <span className="admin-pagination-indicator">
          Page {safePage} of {totalPages}
        </span>
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <FiChevronRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
