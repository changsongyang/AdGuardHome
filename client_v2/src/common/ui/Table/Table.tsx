import React, { useState, useMemo, useCallback, ReactNode } from 'react';
import cn from 'clsx';

import { Loader } from 'panel/common/ui/Loader';
import theme from 'panel/lib/theme';
import { Pagination } from './blocks/Pagination';

import { Icon } from '../Icon';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export interface TableColumn<T = any> {
    key: string;
    header: string;
    accessor?: keyof T | ((row: T) => any);
    render?: (value: any, row: T, index: number) => ReactNode;
    sortable?: boolean;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    className?: string;
}

export interface TableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
    pagination?: boolean;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    sortable?: boolean;
    defaultSort?: {
        key: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
    renderHeaderCheckbox?: () => ReactNode;
    getRowId?: (row: T, index: number) => string | number;
}

export interface TableState {
    currentPage: number;
    pageSize: number;
    sortKey: string | null;
    sortDirection: 'asc' | 'desc';
}

export const Table = <T extends Record<string, any>>({
    data,
    columns,
    loading,
    emptyMessage,
    className,
    pagination = true,
    pageSize: initialPageSize = DEFAULT_PAGE_SIZE_OPTIONS[0],
    onPageSizeChange,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    sortable = true,
    defaultSort,
    onSortChange,
    renderHeaderCheckbox,
    getRowId = (row: T, index: number) => index,
}: TableProps<T>) => {
    const [state, setState] = useState<TableState>({
        currentPage: 0,
        pageSize: initialPageSize,
        sortKey: defaultSort?.key || null,
        sortDirection: defaultSort?.direction || 'asc',
    });

    const sortedData = useMemo(() => {
        if (!state.sortKey || !sortable) {
            return data;
        }

        const column = columns.find((col) => col.key === state.sortKey);
        if (!column || column.sortable === false) {
            return data;
        }

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
            if (aValue == null && bValue == null) {
                return 0;
            }
            if (aValue == null) {
                return 1;
            }
            if (bValue == null) {
                return -1;
            }

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

    const paginatedData = useMemo(() => {
        if (!pagination) {
            return sortedData;
        }

        const startIndex = state.currentPage * state.pageSize;
        return sortedData.slice(startIndex, startIndex + state.pageSize);
    }, [sortedData, pagination, state.currentPage, state.pageSize]);

    const totalPages = Math.ceil(sortedData.length / state.pageSize);

    const handleSort = useCallback(
        (columnKey: string) => {
            const column = columns.find((col) => col.key === columnKey);
            if (!column || column.sortable === false) {
                return;
            }

            let newDirection: 'asc' | 'desc' = 'asc';
            if (state.sortKey === columnKey && state.sortDirection === 'asc') {
                newDirection = 'desc';
            }

            setState((prev) => ({
                ...prev,
                sortKey: columnKey,
                sortDirection: newDirection,
                currentPage: 0,
            }));

            onSortChange?.(columnKey, newDirection);
        },
        [columns, state.sortKey, state.sortDirection, onSortChange],
    );

    const handlePageChange = useCallback((page: number) => {
        setState((prev) => ({ ...prev, currentPage: page }));
    }, []);

    const handlePageSizeChange = useCallback(
        (newSize: number) => {
            setState((prev) => ({
                ...prev,
                pageSize: newSize,
                currentPage: 0,
            }));
            onPageSizeChange?.(newSize);
        },
        [onPageSizeChange],
    );

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
            <div className={theme.table.loading}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={theme.table.tableContainer}>
            <table className={cn(theme.table.table, className)}>
                <thead>
                    <tr>
                        {renderHeaderCheckbox && <th>{renderHeaderCheckbox()}</th>}
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{
                                    width: column.width,
                                    minWidth: column.minWidth,
                                    maxWidth: column.maxWidth,
                                    cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                                }}
                                className={column.className}
                                onClick={() => sortable && column.sortable !== false && handleSort(column.key)}>
                                <div>
                                    <span>{column.header}</span>
                                    {sortable && column.sortable !== false && (
                                        <span>
                                            {state.sortKey === column.key && state.sortDirection === 'asc' && (
                                                <Icon icon="arrow" className={theme.table.sortAsc} />
                                            )}
                                            {state.sortKey === column.key && state.sortDirection === 'desc' && (
                                                <Icon icon="arrow" className={theme.table.sortDesc} />
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
                            return (
                                <tr key={rowId}>
                                    {columns.map((column) => (
                                        <td key={column.key} className={column.className}>
                                            {renderCell(column, row, index)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-4">
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
