import React, { useMemo } from 'react';

import { formatDetailedDateTime, Filter } from 'panel/helpers/helpers';
import intl from 'panel/common/intl';
import { LOCAL_STORAGE_KEYS, LocalStorageHelper } from 'panel/helpers/localStorageHelper';
import { Table as UniversalTable, TableColumn } from 'panel/common/ui/Table';
import { Button } from 'panel/common/ui/Button';
import { CellWrap } from './CellWrap';

type FilterToggleData = {
    name: string;
    url: string;
    enabled: boolean;
};

type ModalPayload = {
    type: string;
    url?: string;
};

type Props = {
    filters: Filter[];
    loading: boolean;
    processingConfigFilter: boolean;
    toggleFilteringModal: (payload?: ModalPayload) => void;
    handleDelete: (url: string) => void;
    toggleFilter: (url: string, data: FilterToggleData) => void;
    whitelist?: boolean;
};

export const Table = ({
    filters,
    loading,
    processingConfigFilter,
    toggleFilteringModal,
    handleDelete,
    toggleFilter,
    whitelist,
}: Props) => {
    const localStorageKey = whitelist ? LOCAL_STORAGE_KEYS.ALLOWLIST_PAGE_SIZE : LOCAL_STORAGE_KEYS.BLOCKLIST_PAGE_SIZE;
    const defaultPageSize = LocalStorageHelper.getItem(localStorageKey) || 10;

    const columns: TableColumn<Filter>[] = useMemo(
        () => [
            {
                key: 'enabled',
                header: intl.getMessage('enabled_table_header'),
                accessor: 'enabled',
                sortable: false,
                width: 90,
                render: (value: boolean, row: Filter) => {
                    const { name, url, enabled } = row;
                    const id = `filter_${url}`;

                    return (
                        <label className="checkbox" htmlFor={id}>
                            <input
                                type="checkbox"
                                id={id}
                                onChange={() => toggleFilter(url, { name, url, enabled })}
                                checked={enabled}
                                disabled={processingConfigFilter}
                            />
                            <span className="checkbox__marker" />
                        </label>
                    );
                },
            },
            {
                key: 'name',
                header: intl.getMessage('name_table_header'),
                accessor: 'name',
                minWidth: 200,
                render: (value: string, row: Filter) => (
                    <div className="logs__row logs__row--overflow">
                        <span className="logs__text" title={value}>
                            {value}
                        </span>
                        {(row as any).checksum && (
                            <div className="logs__text logs__text--checksum" title={(row as any).checksum}>
                                {intl.getMessage('checksum_table_header')}: {(row as any).checksum}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'url',
                header: intl.getMessage('filter_url'),
                accessor: 'url',
                render: (value: string) => (
                    <div className="logs__row logs__row--overflow">
                        <span className="logs__text" title={value}>
                            {value}
                        </span>
                    </div>
                ),
            },
            {
                key: 'rulesCount',
                header: intl.getMessage('rules_count_table_header'),
                accessor: 'rulesCount',
                width: 90,
                render: (value: number) => (
                    <div className="text-center">{value?.toLocaleString() || 0}</div>
                ),
            },
            {
                key: 'lastUpdated',
                header: intl.getMessage('last_time_updated_table_header'),
                accessor: 'lastUpdated',
                width: 200,
                render: (value: string) => {
                    const result = CellWrap({ value }, formatDetailedDateTime);
                    return typeof result === 'string' ? <span>{result}</span> : result;
                },
            },
            {
                key: 'actions',
                header: intl.getMessage('actions_table_header'),
                accessor: 'url',
                sortable: false,
                width: 100,
                render: (value: string) => (
                    <div className="logs__row logs__row--center">
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => toggleFilteringModal({ type: 'edit', url: value })}
                            disabled={processingConfigFilter}
                            title={intl.getMessage('edit_table_action')}
                            className="mr-2"
                            leftAddon={
                                <svg className="icons">
                                    <use xlinkHref="#edit" />
                                </svg>
                            }
                        />
                        <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDelete(value)}
                            disabled={processingConfigFilter}
                            title={intl.getMessage('delete_table_action')}
                            leftAddon={
                                <svg className="icons">
                                    <use xlinkHref="#delete" />
                                </svg>
                            }
                        />
                    </div>
                ),
            },
        ],
        [processingConfigFilter, toggleFilter, toggleFilteringModal, handleDelete]
    );

    const handlePageSizeChange = (newSize: number) => {
        LocalStorageHelper.setItem(localStorageKey, newSize);
    };

    return (
        <UniversalTable<Filter>
            data={filters}
            columns={columns}
            loading={loading}
            emptyMessage={whitelist ? intl.getMessage('no_whitelist_added') : intl.getMessage('no_blocklist_added')}
            pageSize={defaultPageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 30, 40, 50]}
        />
    );
};
