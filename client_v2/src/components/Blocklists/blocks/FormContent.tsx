import React from 'react';

import intl from 'panel/common/intl';
import { MODAL_TYPE } from 'panel/helpers/constants';
import { Tabs } from 'panel/common/ui/Tabs';
import { ManualFilterForm } from './ManualFilterForm';
import { FilterListTab } from './FilterListTab';

interface FormContentProps {
    modalType: string;
    whitelist?: boolean;
    selectedSources?: Record<string, boolean>;
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const FormContent: React.FC<FormContentProps> = ({
    modalType,
    whitelist,
    selectedSources,
    activeTab,
    onTabChange,
}) => {
    if (modalType === MODAL_TYPE.SELECT_MODAL_TYPE) {
        return (
            <Tabs
                activeTab={activeTab}
                onTabChange={onTabChange}
                tabs={[
                    {
                        id: 'manual',
                        label: intl.getMessage('add_custom_list'),
                        content: <ManualFilterForm whitelist={whitelist} />,
                    },
                    {
                        id: 'list',
                        label: intl.getMessage('choose_from_list'),
                        content: <FilterListTab selectedSources={selectedSources} />,
                    },
                ]}
            />
        );
    }

    if (modalType === MODAL_TYPE.CHOOSE_FILTERING_LIST) {
        return <FilterListTab selectedSources={selectedSources} />;
    }

    return <ManualFilterForm whitelist={whitelist} />;
};
