import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'clsx';

import intl from 'panel/common/intl';
import { MODAL_TYPE } from 'panel/helpers/constants';
import { getCurrentFilter } from 'panel/helpers/helpers';
import filtersCatalog from 'panel/helpers/filters/filters';
import { RootState } from 'panel/initialState';
import { PageLoader } from 'panel/common/ui/Loader';
import theme from 'panel/lib/theme';
import {
    getFilteringStatus,
    removeFilter,
    toggleFilterStatus,
    addFilter,
    toggleFilteringModal,
    refreshFilters,
    editFilter,
} from 'panel/actions/filtering';
import { Modal } from './blocks/Modal';
import { Actions } from './blocks/Actions';
import { Table } from './blocks/Table';
import s from './styles.module.pcss';

export const Blocklists = () => {
    const dispatch = useDispatch();
    const filtering = useSelector((state: RootState) => state.filtering!);

    const {
        filters,
        isModalOpen,
        isFilterAdded,
        processingRefreshFilters,
        processingRemoveFilter,
        processingAddFilter,
        processingConfigFilter,
        processingFilters,
        modalType,
        modalFilterUrl,
    } = filtering;

    useEffect(() => {
        dispatch(getFilteringStatus());
    }, [dispatch]);

    const handleSubmit = (values: Record<string, any>) => {
        switch (modalType) {
            case MODAL_TYPE.EDIT_FILTERS:
                dispatch(editFilter(modalFilterUrl, values));
                break;
            case MODAL_TYPE.ADD_FILTERS: {
                break;
            }
            case MODAL_TYPE.CHOOSE_FILTERING_LIST: {
                const changedValues = Object.entries(values)?.reduce((acc: Record<string, any>, [key, value]) => {
                    if (value && key in filtersCatalog.filters) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});

                Object.keys(changedValues).forEach((fieldName) => {
                    const { source, name } = filtersCatalog.filters[fieldName];
                    dispatch(addFilter(source, name));
                });
                break;
            }
            default:
                break;
        }
    };

    const handleDelete = (url: string) => {
        if (window.confirm(intl.getMessage('list_confirm_delete'))) {
            dispatch(removeFilter(url));
        }
    };

    const toggleFilter = (url: string, data: { name: string; url: string; enabled: boolean }) => {
        dispatch(toggleFilterStatus(url, data));
    };

    const handleRefresh = () => {
        dispatch(refreshFilters({ whitelist: false }));
    };

    const openSelectTypeModal = () => {
        dispatch(toggleFilteringModal({ type: MODAL_TYPE.SELECT_MODAL_TYPE }));
    };

    const currentFilterData = getCurrentFilter(modalFilterUrl, filters);
    const loading =
        processingConfigFilter ||
        processingFilters ||
        processingAddFilter ||
        processingRemoveFilter ||
        processingRefreshFilters;

    return (
        <div className={theme.layout.container}>
            <h1 className={cn(theme.layout.title, theme.title.h4, theme.title.h3_tablet, s.title)}>
                {intl.getMessage('blocklists_title')}
            </h1>

            {loading ? (
                <PageLoader />
            ) : (
                <>
                    <Modal
                        isOpen={isModalOpen}
                        toggleFilteringModal={() => dispatch(toggleFilteringModal())}
                        addFilter={(url: string, name: string) => dispatch(addFilter(url, name))}
                        isFilterAdded={isFilterAdded}
                        processingAddFilter={processingAddFilter}
                        processingConfigFilter={processingConfigFilter}
                        handleSubmit={handleSubmit}
                        modalType={modalType}
                        currentFilterData={currentFilterData}
                        whitelist={false}
                        filters={filters}
                        filtersCatalog={filtersCatalog}
                    />

                    <div className="content">
                        <div className="row">
                            <div className="col-md-12">
                                <div>
                                    {intl.getMessage('filters_and_hosts_hint')}
                                    <Table
                                        filters={filters}
                                        loading={loading}
                                        processingConfigFilter={processingConfigFilter}
                                        toggleFilteringModal={(payload?: { type: string; url?: string }) =>
                                            dispatch(toggleFilteringModal(payload))
                                        }
                                        handleDelete={handleDelete}
                                        toggleFilter={toggleFilter}
                                    />

                                    <Actions
                                        handleAdd={openSelectTypeModal}
                                        handleRefresh={handleRefresh}
                                        processingRefreshFilters={processingRefreshFilters}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
