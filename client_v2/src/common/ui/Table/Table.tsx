import React, { useState, useMemo, useCallback } from 'react';
import { TableProps, TableColumn, TableState } from './types';
import { Pagination } from './Pagination';

export const Table = <T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data available',
    className = '',
    
    // Pagination
    pagination = true,
    pageSize: initialPageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 40, 50],
    
    // Sorting
    sortable = true,
    defaultSort,
    onSortChange,
    
    // Selection
    selectable = false,
    selectedRows = new Set(),
    onSelectionChange,
    getRowId = (row: T, index: number) => index,
    
    // Styling
    striped = true,
    bordered = true,
    hover = true,
}: TableProps<T>) => {
    const [state, setState] = useState<TableState>({
        currentPage: 0,
        pageSize: initialPageSize,
        sortKey: defaultSort?.key || null,
        sortDirection: defaultSort?.direction || 'asc',
        selectedRows: new Set(selectedRows),
    });

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!state.sortKey || !sortable) return data;
        
        const column = columns.find(col => col.key === state.sortKey);
        if (!column || column.sortable === false) return data;

        const sortedData = [...data].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (typeof column.accessor === 'function') {
                aValue = column.accessor(a);
                bValue = column.accessor(b);
            } else if (column.accessor) {
                aValue = a[column.accessor];
                bValue = b[column.accessor];
            } else {
                return 0;
            }

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Convert to comparable values
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            let comparison = 0;
            if (aValue < bValue) {
                comparison = -1;
            } else if (aValue > bValue) {
                comparison = 1;
            }

            return state.sortDirection === 'desc' ? -comparison : comparison;
        });
        return sortedData;
    }, [data, columns, state.sortKey, state.sortDirection, sortable]);

    // Pagination logic
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;
        
        const startIndex = state.currentPage * state.pageSize;
        return sortedData.slice(startIndex, startIndex + state.pageSize);
    }, [sortedData, pagination, state.currentPage, state.pageSize]);

    const totalPages = Math.ceil(sortedData.length / state.pageSize);

    // Event handlers
    const handleSort = useCallback((columnKey: string) => {
        const column = columns.find(col => col.key === columnKey);
        if (!column || column.sortable === false) return;

        let newDirection: 'asc' | 'desc' = 'asc';
        if (state.sortKey === columnKey && state.sortDirection === 'asc') {
            newDirection = 'desc';
        }

        setState(prev => ({
            ...prev,
            sortKey: columnKey,
            sortDirection: newDirection,
            currentPage: 0, // Reset to first page when sorting
        }));

        onSortChange?.(columnKey, newDirection);
    }, [columns, state.sortKey, state.sortDirection, onSortChange]);

    const handlePageChange = useCallback((page: number) => {
        setState(prev => ({ ...prev, currentPage: page }));
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setState(prev => ({
            ...prev,
            pageSize: newSize,
            currentPage: 0, // Reset to first page when changing page size
        }));
        onPageSizeChange?.(newSize);
    }, [onPageSizeChange]);

    const handleRowSelection = useCallback((rowId: string | number, selected: boolean) => {
        const newSelected = new Set(state.selectedRows);
        if (selected) {
            newSelected.add(rowId);
        } else {
            newSelected.delete(rowId);
        }
        
        setState(prev => ({ ...prev, selectedRows: newSelected }));
        onSelectionChange?.(newSelected);
    }, [state.selectedRows, onSelectionChange]);

    const handleSelectAll = useCallback((selected: boolean) => {
        let newSelected = new Set<string | number>();
        if (selected) {
            newSelected = new Set();
            paginatedData.forEach((row, index) => {
                newSelected.add(getRowId(row, index));
            });
        }
        
        setState(prev => ({ ...prev, selectedRows: newSelected }));
        onSelectionChange?.(newSelected);
    }, [paginatedData, getRowId, onSelectionChange]);

    // Render cell content
    const renderCell = useCallback((column: TableColumn<T>, row: T, rowIndex: number) => {
        if (column.render) {
            let value = null;
            if (typeof column.accessor === 'function') {
                value = column.accessor(row);
            } else if (column.accessor) {
                value = row[column.accessor];
            }
            return column.render(value, row, rowIndex);
        }

        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }

        if (column.accessor) {
            const value = row[column.accessor];
            return value != null ? String(value) : '';
        }

        return '';
    }, []);

    if (loading) {
        return (
            <div className="table-loading">
                <div className="text-center p-4">Loading...</div>
            </div>
        );
    }

    const tableClasses = [
        'table',
        striped && 'table-striped',
        bordered && 'table-bordered',
        hover && 'table-hover',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className="table-container">
            <table className={tableClasses}>
                <thead>
                    <tr>
                        {selectable && (
                            <th style={{ width: 50 }}>
                                <input
                                    type="checkbox"
                                    checked={paginatedData.length > 0 && paginatedData.every((row, index) => 
                                        state.selectedRows.has(getRowId(row, index))
                                    )}
                                    onChange={e => handleSelectAll(e.target.checked)}
                                />
                            </th>
                        )}
                        {columns.map(column => (
                            <th
                                key={column.key}
                                style={{
                                    width: column.width,
                                    minWidth: column.minWidth,
                                    maxWidth: column.maxWidth,
                                    cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                                }}
                                className={column.className}
                                onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                            >
                                <div className="d-flex align-items-center">
                                    <span>{column.header}</span>
                                    {sortable && column.sortable !== false && (
                                        <span className="ml-1">
                                            {state.sortKey === column.key && state.sortDirection === 'asc' && ' ▲'}
                                            {state.sortKey === column.key && state.sortDirection === 'desc' && ' ▼'}
                                            {state.sortKey !== column.key && (
                                                <span style={{ opacity: 0.3 }}> ▲</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => {
                            const rowId = getRowId(row, index);
                            const isSelected = state.selectedRows.has(rowId);
                            
                            return (
                                <tr key={rowId} className={isSelected ? 'table-active' : ''}>
                                    {selectable && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={e => handleRowSelection(rowId, e.target.checked)}
                                            />
                                        </td>
                                    )}
                                    {columns.map(column => (
                                        <td key={column.key} className={column.className}>
                                            {renderCell(column, row, index)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center p-4">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && sortedData.length > 0 && (
                <Pagination
                    currentPage={state.currentPage}
                    totalPages={totalPages}
                    pageSize={state.pageSize}
                    totalItems={sortedData.length}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
};
