import React from 'react';

import filtersCatalog from 'panel/helpers/filters/filters';
import { FiltersList } from './FiltersList';

interface FilterListTabProps {
    selectedSources?: Record<string, boolean>;
}

export const FilterListTab: React.FC<FilterListTabProps> = ({ selectedSources }) => {
    return (
        <FiltersList
            categories={filtersCatalog.categories}
            filters={filtersCatalog.filters}
            selectedSources={selectedSources}
        />
    );
};
