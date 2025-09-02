import React, { useMemo } from 'react';

import { formatDetailedDateTime, Filter } from 'panel/helpers/helpers';
import intl from 'panel/common/intl';
import { LOCAL_STORAGE_KEYS, LocalStorageHelper } from 'panel/helpers/localStorageHelper';
import { MODAL_TYPE } from 'panel/helpers/constants';
import { Table as ReactTable, TableColumn } from 'panel/common/ui/Table';
import { Switch } from 'panel/common/controls/Switch';
import { Icon } from 'panel/common/ui/Icon';
import theme from 'panel/lib/theme';

const DEFAULT_PAGE_SIZE = 10;

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
    processingConfigFilter: boolean;
    toggleFilteringModal: (payload?: ModalPayload) => void;
    handleDelete: (url: string, name: string) => void;
    toggleFilter: (url: string, data: FilterToggleData) => void;
};

export const Table = ({ filters, processingConfigFilter, toggleFilteringModal, handleDelete, toggleFilter }: Props) => {
    const pageSize = useMemo(
        () => LocalStorageHelper.getItem(LOCAL_STORAGE_KEYS.BLOCKLIST_PAGE_SIZE) || DEFAULT_PAGE_SIZE,
        [],
    );

    const columns: TableColumn<Filter>[] = useMemo(
        () => [
            {
                key: 'enabled',
                header: intl.getMessage('enabled_table_header'),
                accessor: 'enabled',
                sortable: false,
                render: (value: boolean, row: Filter) => {
                    const { name, url, enabled } = row;
                    const id = `filter_${url}`;

                    return (
                        <Switch
                            id={id}
                            checked={enabled}
                            onChange={() => toggleFilter(url, { name, url, enabled: !enabled })}
                            disabled={processingConfigFilter}
                        />
                    );
                },
            },
            {
                key: 'name',
                header: intl.getMessage('name_label'),
                accessor: 'name',
                render: (value: string, row: Filter) => (
                    <div>
                        <span title={value}>{value}</span>
                        {(row as any).checksum && (
                            <div title={(row as any).checksum}>
                                {intl.getMessage('checksum_table_header')}: {(row as any).checksum}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'url',
                header: intl.getMessage('url_label'),
                accessor: 'url',
                render: (value: string) => (
                    <div>
                        <span title={value}>{value}</span>
                    </div>
                ),
            },
            {
                key: 'rulesCount',
                header: intl.getMessage('rules_label'),
                accessor: 'rulesCount',
                render: (value: number) => <div>{value?.toLocaleString() || 0}</div>,
            },
            {
                key: 'lastUpdated',
                header: intl.getMessage('last_updated_label'),
                accessor: 'lastUpdated',
                render: (value: string) => {
                    const result = formatDetailedDateTime(value);
                    return typeof result === 'string' ? <span>{result}</span> : result;
                },
            },
            {
                key: 'actions',
                header: intl.getMessage('actions_label'),
                accessor: 'url',
                sortable: false,
                render: (value: string, row: Filter) => (
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleFilteringModal({ type: MODAL_TYPE.EDIT_FILTERS, url: value })}
                            disabled={processingConfigFilter}
                            className={theme.table.action}>
                            <Icon icon="edit" color="gray" />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(value, row.name)}
                            disabled={processingConfigFilter}
                            className={theme.table.action}>
                            <Icon icon="delete" color="red" />
                        </button>
                    </div>
                ),
            },
        ],
        [processingConfigFilter, toggleFilter, toggleFilteringModal, handleDelete],
    );

    const handlePageSizeChange = (newSize: number) => {
        LocalStorageHelper.setItem(LOCAL_STORAGE_KEYS.BLOCKLIST_PAGE_SIZE, newSize);
    };

    return (
        <ReactTable<Filter>
            data={filters}
            columns={columns}
            emptyMessage={intl.getMessage('no_blocklist_added')}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
        />
    );
};
