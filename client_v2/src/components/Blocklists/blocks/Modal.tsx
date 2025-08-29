import React from 'react';

import intl from 'panel/common/intl';
import { Dialog } from 'panel/common/ui/Dialog/Dialog';
import { MODAL_TYPE } from 'panel/helpers/constants';
import { getMap, Filter } from 'panel/helpers/helpers';
import { Form, FormValues } from './Form';

const MODAL_TYPE_TO_TITLE_TYPE_MAP = {
    [MODAL_TYPE.EDIT_FILTERS]: 'edit',
    [MODAL_TYPE.ADD_FILTERS]: 'new',
    [MODAL_TYPE.EDIT_CLIENT]: 'edit',
    [MODAL_TYPE.ADD_CLIENT]: 'new',
    [MODAL_TYPE.SELECT_MODAL_TYPE]: 'new',
    [MODAL_TYPE.CHOOSE_FILTERING_LIST]: 'choose',
};

/**
 * @param modalType {'EDIT_FILTERS' | 'ADD_FILTERS' | 'CHOOSE_FILTERING_LIST'}
 * @param whitelist {boolean}
 * @returns {'new_allowlist' | 'edit_allowlist' | 'choose_allowlist' |
 *           'new_blocklist' | 'edit_blocklist' | 'choose_blocklist' | null}
 */
const getTitle = (modalType: string, whitelist?: boolean) => {
    const titleType = MODAL_TYPE_TO_TITLE_TYPE_MAP[modalType];
    if (!titleType) {
        return null;
    }
    return `${titleType}_${whitelist ? 'allowlist' : 'blocklist'}`;
};

interface SelectedValues {
    selectedFilterIds: Record<string, boolean>;
    selectedSources: Record<string, boolean>;
}

const getSelectedValues = (filters: Filter[], catalogSourcesToIdMap: Record<string, number>): SelectedValues =>
    filters.reduce(
        (acc: SelectedValues, { url }: Filter) => {
            if (Object.prototype.hasOwnProperty.call(catalogSourcesToIdMap, url)) {
                const fieldId = `filter${catalogSourcesToIdMap[url]}`;
                acc.selectedFilterIds[fieldId] = true;
                acc.selectedSources[url] = true;
            }
            return acc;
        },
        {
            selectedFilterIds: {} as Record<string, boolean>,
            selectedSources: {} as Record<string, boolean>,
        } as SelectedValues,
    );

type FiltersCatalog = {
    categories: Record<string, { name: string; description: string }>;
    filters: Record<string, { source: string; name: string; categoryId: string; homepage: string }>;
};

type Props = {
    toggleFilteringModal: () => void;
    isOpen: boolean;
    addFilter: (url: string, name: string) => void;
    isFilterAdded: boolean;
    processingAddFilter: boolean;
    processingConfigFilter: boolean;
    handleSubmit: (values: FormValues) => void;
    modalType: string;
    currentFilterData: Partial<Filter>;
    whitelist?: boolean;
    filters: Filter[];
    filtersCatalog: FiltersCatalog;
};

export const Modal = ({
    isOpen,
    processingAddFilter,
    processingConfigFilter,
    handleSubmit,
    modalType,
    currentFilterData,
    whitelist,
    toggleFilteringModal,
    filters,
    filtersCatalog,
}: Props) => {
    const closeModal = () => {
        toggleFilteringModal();
    };

    let initialValues: Partial<FormValues> | undefined;
    let selectedSources: Record<string, boolean> | undefined;
    switch (modalType) {
        case MODAL_TYPE.EDIT_FILTERS:
            initialValues = currentFilterData as Partial<FormValues>;
            break;
        case MODAL_TYPE.CHOOSE_FILTERING_LIST: {
            const catalogSourcesToIdMap = getMap(Object.values(filtersCatalog.filters), 'source', 'id');

            const selectedValues = getSelectedValues(filters, catalogSourcesToIdMap);
            initialValues = selectedValues.selectedFilterIds as Partial<FormValues>;
            selectedSources = selectedValues.selectedSources;
            break;
        }
        default:
            break;
    }

    const title = getTitle(modalType, whitelist) ? intl.getMessage(getTitle(modalType, whitelist)) : '';

    return (
        <Dialog visible={isOpen} onClose={closeModal} title={title}>
            <Form
                selectedSources={selectedSources}
                initialValues={initialValues}
                modalType={modalType}
                onSubmit={handleSubmit}
                processingAddFilter={processingAddFilter}
                processingConfigFilter={processingConfigFilter}
                closeModal={closeModal}
                whitelist={whitelist}
                toggleFilteringModal={toggleFilteringModal}
            />
        </Dialog>
    );
};
