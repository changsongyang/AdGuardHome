import React from 'react';
import { PaginationProps } from './types';

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
    previousText = 'Previous',
    nextText = 'Next',
    pageText = 'Page',
    rowsText = 'rows',
}) => {
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    return (
        <div className="table-pagination">
            <div className="pagination-info">
                {pageText} {currentPage + 1} / {totalPages} | {rowsText}: {totalItems}
            </div>
            
            <div className="pagination-controls">
                <button
                    onClick={() => onPageChange(0)}
                    disabled={!canPreviousPage}
                    className="btn btn-sm btn-outline-secondary"
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canPreviousPage}
                    className="btn btn-sm btn-outline-secondary"
                >
                    {previousText}
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canNextPage}
                    className="btn btn-sm btn-outline-secondary"
                >
                    {nextText}
                </button>
                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={!canNextPage}
                    className="btn btn-sm btn-outline-secondary"
                >
                    {'>>'}
                </button>
            </div>

            <select
                value={pageSize}
                onChange={e => onPageSizeChange(Number(e.target.value))}
                className="form-control form-control-sm"
                style={{ width: 'auto', display: 'inline-block' }}
            >
                {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                        {size} {rowsText}
                    </option>
                ))}
            </select>
        </div>
    );
};
