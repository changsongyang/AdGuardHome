import { ReactNode } from 'react';

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
    
    // Pagination
    pagination?: boolean;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    
    // Sorting
    sortable?: boolean;
    defaultSort?: {
        key: string;
        direction: 'asc' | 'desc';
    };
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
    
    // Selection
    selectable?: boolean;
    selectedRows?: Set<string | number>;
    onSelectionChange?: (selected: Set<string | number>) => void;
    getRowId?: (row: T, index: number) => string | number;
    
    // Styling
    striped?: boolean;
    bordered?: boolean;
    hover?: boolean;
}

export interface TableState {
    currentPage: number;
    pageSize: number;
    sortKey: string | null;
    sortDirection: 'asc' | 'desc';
    selectedRows: Set<string | number>;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    pageSizeOptions: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    previousText?: string;
    nextText?: string;
    pageText?: string;
    rowsText?: string;
}
